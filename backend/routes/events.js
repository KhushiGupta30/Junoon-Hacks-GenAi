const express = require('express');
const { auth, authorize } = require('../middleware/auth');
const EventService = require('../services/EventService');
const NotificationService = require('../services/NotificationService');
const GoogleEventsService = require('../services/GoogleEventsService');

const router = express.Router();

// Get all internally-created events
router.get('/', auth, async (req, res) => {
    try {
        const events = await EventService.findUpcoming();
        res.json({ events });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching events' });
    }
});

// Create a new internal event
router.post('/', [auth, authorize('ambassador')], async (req, res) => {
    try {
        const eventData = {
            ...req.body,
            creatorId: req.user.id,
            creatorName: req.user.name,
            attendees: [],
        };
        const newEvent = await EventService.create(eventData);

        await NotificationService.createNotification(
            req.user.id,
            `You successfully created the event: "${newEvent.title}"`,
            'success',
            `/ambassador/community`
        );

        res.status(201).json(newEvent);
    } catch (error) {
        res.status(400).json({ message: 'Error creating event', error });
    }
});

// Join an internal event
router.post('/:id/join', [auth, authorize('artisan')], async (req, res) => {
    try {
        const eventId = req.params.id;
        const userId = req.user.id;

        const updatedEvent = await EventService.addAttendee(eventId, userId);
        const eventCreator = updatedEvent.creatorId;

        await NotificationService.createNotification(
            eventCreator,
            `${req.user.name} has joined your event: "${updatedEvent.title}"`,
            'info',
            `/ambassador/community`
        );

        res.status(200).json({ message: 'Successfully joined event!', event: updatedEvent });
    } catch (error) {
        res.status(400).json({ message: 'Error joining event', error: error.message });
    }
});

// --- Google Event Routes ---

// GET nearby events (from cache or new fetch if cache is old/empty)
// This is the main route your frontend should call to display events.
router.get('/nearby', auth, async (req, res) => {
  try {
    // Calls getNearbyEvents with forceRefresh = false (or undefined, which defaults to false)
    const events = await GoogleEventsService.getNearbyEvents(req.user.id, false);
    res.json(events);
  } catch (error) {
    console.error('Error fetching nearby events:', error.message);
    res.status(500).json({ message: 'Server error retrieving nearby events' });
  }
});

// POST to refresh nearby events (bypasses cache)
// Your "Refresh" button in the UI should call this route.
router.post('/nearby/refresh', auth, async (req, res) => {
  try {
    // Explicitly calls with forceRefresh = true
    const events = await GoogleEventsService.getNearbyEvents(req.user.id, true);
    res.json(events);
  } catch (error) {
    console.error('Error refreshing nearby events:', error.message);
    res.status(500).json({ message: 'Server error retrieving nearby events' });
  }
});

module.exports = router;