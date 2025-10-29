const BaseService = require("./BaseService");

class MentorshipService extends BaseService {
  constructor() {
    super("mentorships");
  }

  static async acceptMentorshipRequest(requestId, artisanId) {
    const mentorship = await Mentorship.findById(requestId);

    if (!mentorship) {
      throw new Error("Mentorship request not found");
    }

    if (mentorship.artisan.toString() !== artisanId) {
      throw new Error("You are not authorized to accept this request");
    }

    mentorship.status = "accepted";
    await mentorship.save();

    // Create notifications for both the artisan and the ambassador
    await NotificationService.createNotification(
      mentorship.artisan,
      `You have accepted the mentorship request from ${mentorship.ambassador.name}`,
      "success",
      "/artisan/community"
    );

    await NotificationService.createNotification(
      mentorship.ambassador,
      `${mentorship.artisan.name} has accepted your mentorship request`,
      "success",
      "/ambassador/artisans"
    );

    return mentorship;
  }

  // Find all artisans mentored by a specific ambassador
  async findArtisansByAmbassador(ambassadorId) {
    return this.findMany({ ambassadorId: ambassadorId, status: "active" });
  }

  // Find the ambassador for a specific artisan
  async findAmbassadorByArtisan(artisanId) {
    return this.findOne({ artisanId: artisanId, status: "active" });
  }

  // Create a new mentorship request (can be initiated by either)
  async requestMentorship(artisanId, ambassadorId) {
    // Ensure a request doesn't already exist
    const existing = await this.findOne({ artisanId, ambassadorId });
    if (existing) {
      throw new Error("A mentorship relationship or request already exists.");
    }
    return this.create({
      artisanId,
      ambassadorId,
      status: "pending",
      startedAt: null,
    });
  }

  async acceptMentorship(mentorshipId, artisanId) {
    this.logger.info(
      `Artisan ${artisanId} accepting mentorship ${mentorshipId}`
    );
    const mentorship = await this.getById(mentorshipId);

    if (!mentorship) {
      throw new Error("Mentorship request not found");
    }

    if (mentorship.artisanId !== artisanId) {
      throw new Error("You are not authorized to accept this request");
    }

    if (mentorship.status !== "pending") {
      throw new Error("This request is not pending");
    }

    await this.update(mentorshipId, { status: "active" });

    return { message: "Mentorship accepted successfully", mentorshipId };
  }
}

module.exports = new MentorshipService();
