const BaseService = require("./BaseService");

class EventService extends BaseService {
  constructor() {
    super("events");
  }

  async findUpcoming() {
    return this.findMany(
      { date: { ">=": new Date() } },
      { sortBy: "date", sortOrder: "asc" }
    );
  }

  async findByCreator(creatorId) {
    return this.findMany({ creatorId });
  }

  async addAttendee(eventId, userId) {
    const event = await this.findById(eventId);
    if (!event) throw new Error("Event not found.");

    if (event.attendees?.includes(userId)) {
      console.log("User is already an attendee.");
      return event;
    }

    const attendees = [...(event.attendees || []), userId];
    return this.update(eventId, { attendees });
  }
}

module.exports = new EventService();
