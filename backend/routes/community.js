const express = require('express');
const { auth, authorize } = require('../middleware/auth');
const UserService = require('../services/UserService');
const router = express.Router();

router.get('/local-data', [auth, authorize('artisan')], async (req, res) => {
    try {
        const user = await UserService.findById(req.user.id);
        const location = user.profile?.location?.city || 'New Delhi';

        const localArtisans = await UserService.findMany({ role: 'artisan', 'profile.location.city': location });
        const nearbyAmbassadors = await UserService.findMany({ role: 'ambassador', 'profile.location.city': location });

        const mockEvents = [
            { id: 1, title: 'Hauz Khas Village Art Market', date: 'Sat, 27 Sep 2025', location: 'Hauz Khas Village', description: 'Monthly market to showcase and sell creations.' },
            { id: 2, title: 'Digital Marketing Workshop', date: 'Wed, 01 Oct 2025', location: 'Online via Zoom', description: 'Learn social media skills to boost sales.' },
        ];
        const mockDiscussions = [
            { id: 1, title: 'Best place for high-quality clay in Delhi?', author: 'Rohan V.', replies: 5, lastReplyTime: '2h ago', link: '#' },
            { id: 2, title: 'Tips for pricing jewelry for international buyers', author: 'Priya S.', replies: 12, lastReplyTime: '1d ago', link: '#' },
            { id: 3, title: 'Showcase: My latest wood carving project', author: 'Sanjay K.', replies: 8, lastReplyTime: '3d ago', link: '#' },
        ];


        res.json({
            location: location,
            areaAmbassador: nearbyAmbassadors[0] || null,
            localArtisans: localArtisans,
            upcomingEvents: mockEvents,
            discussionTopics: mockDiscussions
        });
    } catch (error) {
        console.error('Community data error:', error);
        res.status(500).json({ message: 'Server error while fetching community data' });
    }
});

module.exports = router;