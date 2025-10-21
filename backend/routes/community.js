const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const UserService = require('../services/UserService');
const EventService = require('../services/EventService');
const { getDistance } = require('../utils/geolocation');

// GET /api/community
router.get('/', auth, async (req, res) => {
    try {
        const user = req.user;
        const userLocation = user.profile?.location;

        if (!userLocation?.city || !userLocation?.latitude) {
            return res.status(400).json({ message: "Your profile location is incomplete." });
        }

        // 1. Find the Area Ambassador (the closest one in the same state)
        const stateAmbassadors = await UserService.findMany({
            role: 'ambassador',
            'profile.location.state': userLocation.state
        });

        let closestAmbassador = null;
        if (stateAmbassadors.length > 0) {
            const ambassadorsWithDistance = stateAmbassadors
                .map(ambassador => {
                    const distance = getDistance(
                        userLocation.latitude,
                        userLocation.longitude,
                        ambassador.profile.location.latitude,
                        ambassador.profile.location.longitude
                    );
                    return { ...ambassador, distance };
                });
            ambassadorsWithDistance.sort((a, b) => a.distance - b.distance);
            closestAmbassador = ambassadorsWithDistance[0];
        }

        // 2. Find Local Artisans (closest 5 in the same state)
        const stateArtisans = await UserService.findMany({
            role: 'artisan',
            'profile.location.state': userLocation.state
        });
        
        const localArtisans = stateArtisans
            .filter(artisan => artisan.id !== user.id)
            .map(artisan => {
                const distance = getDistance(
                    userLocation.latitude,
                    userLocation.longitude,
                    artisan.profile.location.latitude,
                    artisan.profile.location.longitude
                );
                return { id: artisan.id, name: artisan.name, avatar: artisan.profile?.avatar, craft: artisan.artisanProfile?.craftSpecialty?.join(', '), distance: `${Math.round(distance)} km away` };
            })
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 5);


        // 3. Find Upcoming Events in the user's city
        const upcomingEvents = await EventService.findMany(
            { 'location.city': userLocation.city, date: { '>=': new Date() } },
            { sortBy: 'date', sortOrder: 'asc' }
        );


        // 4. Assemble the dynamic community data
        const communityData = {
            location: `${userLocation.city}, ${userLocation.state}`,
            areaAmbassador: closestAmbassador ? {
                name: closestAmbassador.name,
                avatar: closestAmbassador.profile?.avatar || "https://images.unsplash.com/photo-1521146764736-56c929d59c83?auto=format&fit=crop&w=200&q=80",
                title: `KalaGhar Ambassador - ${closestAmbassador.profile?.location?.city || 'Local Area'}`,
                bio: closestAmbassador.ambassadorProfile?.bio || "Passionate about empowering local artisans.",
                specialties: closestAmbassador.ambassadorProfile?.specialties || ["Business Scaling"]
            } : { // Fallback if no ambassador is found
                name: "Community Support",
                avatar: "https://placehold.co/100x100/4285F4/FFFFFF?text=CS",
                title: "KalaGhar Team",
                bio: "No local ambassador assigned yet. Contact our main support for help.",
                specialties: ["General Support"]
            },
            localArtisans,
            upcomingEvents: upcomingEvents.map(event => ({
                id: event.id,
                title: event.title,
                date: new Date(event.date).toDateString(),
                location: event.location.name || event.location.city,
                description: event.description,
            })),
        };

        res.status(200).json(communityData);

    } catch (error) {
        console.error("Error fetching dynamic community data:", error);
        res.status(500).json({ message: "Server error while fetching community data." });
    }
});

module.exports = router;