const express = require('express');
const { auth, authorize } = require('../middleware/auth');
const EventService = require('../services/EventService');
const NotificationService = require('../services/NotificationService'); 

const router = express.Router();

router.get('/', auth, async (req, res) => {
    try {
        const events = await EventService.findUpcoming();
        res.json({ events });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching events' });
    }
});

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

module.exports = router;
