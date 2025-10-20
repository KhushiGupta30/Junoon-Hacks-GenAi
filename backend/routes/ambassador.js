const express = require("express");
const { body, validationResult } = require("express-validator");
const AmbassadorService = require("../services/AmbassadorService");
const { auth, authorize } = require("../middleware/auth");
const MentorshipService = require("../services/MentorshipService");
const UserService = require("../services/UserService");

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
