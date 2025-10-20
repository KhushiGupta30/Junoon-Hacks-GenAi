const express = require('express');
const { auth, authorize } = require('../middleware/auth');
const MentorshipService = require('../services/MentorshipService');
const NotificationService = require('../services/NotificationService');
const UserService = require('../services/UserService');

const router = express.Router();

// GET /api/mentorship/my-mentor - For an artisan to find their current mentor
router.get('/my-mentor', [auth, authorize('artisan')], async (req, res) => {
    try {
        const mentorship = await MentorshipService.findAmbassadorByArtisan(req.user.id);
        if (!mentorship) {
            return res.json({ mentor: null });
        }
        const mentor = await UserService.findById(mentorship.ambassadorId);
        res.json({ mentor: UserService.toJSON(mentor) });
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching mentor.' });
    }
});

// GET /api/mentorship/requests - For an artisan to see pending requests
router.get('/requests', [auth, authorize('artisan')], async (req, res) => {
    try {
        const pendingMentorships = await MentorshipService.findMany({ artisanId: req.user.id, status: 'pending' });
        if (pendingMentorships.length === 0) {
            return res.json({ requests: [] });
        }
        // Get the details of the ambassadors who made the requests
        const ambassadorIds = pendingMentorships.map(p => p.ambassadorId);
        const ambassadors = await UserService.findMany({ 'id': { in: ambassadorIds } });
        const ambassadorMap = new Map(ambassadors.map(a => [a.id, a]));

        const requests = pendingMentorships.map(p => ({
            id: p.id,
            ambassador: UserService.toJSON(ambassadorMap.get(p.ambassadorId)),
        }));
        
        res.json({ requests });
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching requests.' });
    }
});

// GET /api/mentorship/status/:artisanId - Check mentorship status for a specific artisan
router.get('/status/:artisanId', auth, async (req, res) => {
    try {
        const { artisanId } = req.params;
        const ambassadorId = req.user.id;
        
        const existing = await MentorshipService.findOne({ artisanId, ambassadorId });
        if (existing) {
            return res.json({ status: existing.status }); // 'pending' or 'active'
        }

        const artisanMentorship = await MentorshipService.findAmbassadorByArtisan(artisanId);
        if (artisanMentorship) {
            return res.json({ status: 'mentored_by_other' });
        }

        res.json({ status: 'available' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});


// POST /api/mentorship/request/:artisanId - Ambassador requests to mentor an artisan
router.post('/request/:artisanId', [auth, authorize('ambassador')], async (req, res) => {
    try {
        const { artisanId } = req.params;
        const ambassadorId = req.user.id;

        const artisan = await UserService.findById(artisanId);
        if (!artisan) {
            return res.status(404).json({ message: 'Artisan not found' });
        }

        const mentorship = await MentorshipService.requestMentorship(artisanId, ambassadorId);

        await NotificationService.createNotification(
            artisanId,
            `${req.user.name} has requested to be your mentor.`,
            'mentorship_request',
            `/artisan/dashboard`
        );

        res.status(201).json({ message: 'Mentorship request sent successfully!', mentorship });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT /api/mentorship/accept/:mentorshipId - Artisan accepts a request
router.put('/accept/:mentorshipId', [auth, authorize('artisan')], async (req, res) => {
    try {
        const { mentorshipId } = req.params;
        const mentorship = await MentorshipService.findById(mentorshipId);
        
        if (mentorship.artisanId !== req.user.id) {
            return res.status(403).json({ message: 'You are not authorized to accept this request.' });
        }

        const updatedMentorship = await MentorshipService.acceptMentorship(mentorshipId);

        await NotificationService.createNotification(
            updatedMentorship.ambassadorId,
            `${req.user.name} has accepted your mentorship request!`,
            'success',
            `/ambassador/artisans`
        );

        res.json({ message: 'Mentorship accepted!', mentorship: updatedMentorship });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
