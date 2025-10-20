const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');

// GET /api/community
router.get('/', auth, async (req, res) => {
    try {
        // This data is currently mocked. You can replace this
        // with dynamic data from your Firestore database later.
        const communityData = {
            location: "New Delhi, Delhi",
            areaAmbassador: {
                name: "Anjali Singh",
                avatar: "https://images.unsplash.com/photo-1521146764736-56c929d59c83?auto=format&fit=crop&w=200&q=80",
                title: "KalaGhar Ambassador - South Delhi",
                bio: "Seasoned textile artist passionate about helping local artisans access new markets and funding.",
                specialties: ["Textile Arts", "Business Scaling", "Grant Apps"]
            },
            localArtisans: [
                { id: 1, name: 'Rohan Verma', avatar: 'https://placehold.co/100x100/34A853/FFFFFF?text=RV', craft: 'Pottery', distance: '2.5 km away' },
                { id: 2, name: 'Meera Patel', avatar: 'https://placehold.co/100x100/4285F4/FFFFFF?text=MP', craft: 'Madhubani Painting', distance: '4.1 km away' },
            ],
            upcomingEvents: [
                { id: 1, title: 'Hauz Khas Village Art Market', date: 'Sat, 27 Sep 2025', location: 'Hauz Khas Village', description: 'Monthly market to showcase and sell creations.' },
                { id: 2, title: 'Digital Marketing Workshop', date: 'Wed, 01 Oct 2025', location: 'Online via Zoom', description: 'Learn social media skills to boost sales.' },
            ],
        };

        res.status(200).json(communityData);

    } catch (error) {
        console.error("Error fetching community data:", error);
        res.status(500).json({ message: "Server error while fetching community data." });
    }
});

module.exports = router;