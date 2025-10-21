const express = require("express");
const { body, validationResult } = require("express-validator");
const AmbassadorService = require("../services/AmbassadorService");
const { auth, authorize } = require("../middleware/auth");
const MentorshipService = require("../services/MentorshipService");
const UserService = require("../services/UserService");
const { getDistance } = require('../utils/geolocation');

const router = express.Router();

router.post(
  "/apply",
  [
    body("fullName")
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage("Full name must be between 2 and 100 characters"),
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Please provide a valid email"),
    body("location").trim().notEmpty().withMessage("Location is required"),
    body("reason")
      .trim()
      .isLength({ min: 10 })
      .withMessage("Reason must be at least 10 characters long"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const applicationData = {
        ...req.body,
        status: "pending",
        submittedAt: new Date(),
      };

      const application = await AmbassadorService.createApplication(
        applicationData
      );
      res
        .status(201)
        .json({ message: "Application submitted successfully", application });
    } catch (error) {
      console.error("Ambassador application error:", error);
      res
        .status(500)
        .json({ message: "Server error during application submission" });
    }
  }
);

router.get("/nearest", auth, async (req, res) => {
    try {
        const currentUser = req.user;
        const userLocation = currentUser.profile?.location;

        if (!userLocation?.latitude || !userLocation?.longitude) {
            return res.status(400).json({ message: "Your location is not set." });
        }

        const allAmbassadors = await UserService.findMany({ role: 'ambassador' });

        const ambassadorsWithDistance = allAmbassadors
            .filter(ambassador =>
                ambassador.id !== currentUser.id &&
                ambassador.profile?.location?.latitude &&
                ambassador.profile?.location?.longitude
            )
            .map(ambassador => {
                const distance = getDistance(
                    userLocation.latitude,
                    userLocation.longitude,
                    ambassador.profile.location.latitude,
                    ambassador.profile.location.longitude
                );
                return { ...UserService.toJSON(ambassador), distance: Math.round(distance) };
            });

        ambassadorsWithDistance.sort((a, b) => a.distance - b.distance);

        res.json({ ambassadors: ambassadorsWithDistance.slice(0, 5) });
    } catch (error) {
        console.error("Failed to fetch nearest ambassadors:", error);
        res.status(500).json({ message: "Server error while fetching nearest ambassadors." });
    }
});


router.get("/artisans", [auth, authorize("ambassador")], async (req, res) => {
  try {
    const mentorships = await MentorshipService.findArtisansByAmbassador(
      req.user.id
    );
    const artisanIds = mentorships.map((m) => m.artisanId);

    if (artisanIds.length === 0) {
      return res.json({ artisans: [] });
    }

    // Fetch user details for each artisan
    const artisans = await UserService.findMany({ id: { in: artisanIds } });

    res.json({ artisans: artisans.map(UserService.toJSON) });
  } catch (error) {
    console.error("Failed to fetch mentored artisans:", error);
    res.status(500).json({ message: "Server error while fetching artisans." });
  }
});

module.exports = router;
