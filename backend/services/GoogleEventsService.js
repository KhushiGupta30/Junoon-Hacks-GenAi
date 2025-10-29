const { db } = require("../firebase");
const axios = require("axios");
const userServiceInstance = require("./UserService");

const dateRegex =
  /(\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2}(st|nd|rd|th)?(-\d{1,2}(?:st|nd|rd|th)?)?\b)|(\d{4}-\d{2}-\d{2})|(\d{1,2}\/\d{1,2}\/\d{2,4})/;

class GoogleEventsService {
  constructor() {
    this.cacheCollection = db.collection("nearby_events_cache");
    this.userService = userServiceInstance;
    this.GOOGLE_API_KEY = process.env.GOOGLE_CSE_API_KEY;
    this.GOOGLE_CSE_ID = process.env.GOOGLE_CSE_ID;
  }

  parseEventDate(snippet) {
    const match = snippet.match(dateRegex);
    return match ? match[0].replace(/[,.]+$/, "").trim() : "Date not specified";
  }

  /**
   * Fetches events from Google CSE using coordinate-based search.
   * @param {string} locationQuery - Fallback text query (e.g., "New Delhi, Delhi")
   * @param {object} coordinates - User's coordinates { latitude, longitude }
   * @param {number} radiusKm - Search radius in kilometers
   * @returns {Array} - Array of event objects
   */
  async fetchEventsFromGoogle(
    locationQuery,
    coordinates = null,
    radiusKm = 50
  ) {
    if (!this.GOOGLE_API_KEY || !this.GOOGLE_CSE_ID) {
      console.warn("Google CSE API Key or ID missing. Skipping event search.");
      return [];
    }

    const queryBase = `"craft fair" OR "art exhibition" OR "handicraft mela" OR "makers market" OR "handloom exhibition" OR "artisan market"`;
    let query = "";

    const params = {
      key: this.GOOGLE_API_KEY,
      cx: this.GOOGLE_CSE_ID,
      num: 10,
      gl: "in",
      cr: "countryIN",
      sort: "date",
    };

    if (coordinates && coordinates.latitude && coordinates.longitude) {
      const locationFilter = `more:p:location:${coordinates.latitude}:${coordinates.longitude}:${radiusKm}km`;
      query = `${queryBase} ${locationFilter}`;
      console.log(`Using coordinates in query: ${locationFilter}`);
    } else if (locationQuery) {
      query = `${queryBase} ${locationQuery}`;
      console.log(`Using location query: ${locationQuery}`);
    } else {
      console.warn("No location or coordinates provided for event search.");
      return [];
    }

    params.q = query;

    const url = `https://www.googleapis.com/customsearch/v1`;

    try {
      console.log(`Sending Google Search Query: ${params.q}`);
      const response = await axios.get(url, { params });

      if (!response.data.items) {
        console.log(`No Google Search results found.`);
        return [];
      }

      const events = response.data.items
        .map((item) => {
          const snippet = item.snippet.replace(/[\n\t]+/g, " ").trim();
          return {
            title: item.title,
            link: item.link,
            snippet: snippet,
            source: item.displayLink,
            date: this.parseEventDate(snippet),
          };
        })
        .filter((event) => event !== null);

      console.log(`Found ${events.length} potentially relevant events.`);
      return events;
    } catch (error) {
      console.error(
        "Error fetching Google CSE:",
        error.response?.data?.error || error.message
      );
      if (error.response?.data) {
        console.error(
          "API Error Details:",
          JSON.stringify(error.response.data, null, 2)
        );
      }
      return [];
    }
  }

  async getNearbyEvents(userId, forceRefresh = false) {
    const user = await this.userService.findById(userId);
    const location = user?.profile?.location;
    const coordinates = user?.coordinates;

    if (!location || !location.city) {
      console.error(`User ${userId} location (city) is not set.`);
      return [];
    }

    const locationQuery = `${location.city}${
      location.state ? ", " + location.state : ""
    }`;
    const locationKey = `${location.city}${
      location.state ? "_" + location.state : ""
    }`
      .toLowerCase()
      .replace(/\s+/g, "_");

    const cacheDocRef = this.cacheCollection.doc(locationKey);
    const now = new Date();

    try {
      if (!forceRefresh) {
        const cacheDoc = await cacheDocRef.get();
        if (cacheDoc.exists) {
          const data = cacheDoc.data();
          const sixHoursAgo = new Date(now.getTime() - 6 * 60 * 60 * 1000);
          if (data.updatedAt.toDate() > sixHoursAgo) {
            console.log(`Returning cached events for ${locationKey}`);
            return data.events;
          } else {
            console.log(`Cache expired for ${locationKey}`);
          }
        }
      } else {
        console.log(`Forcing cache refresh for ${locationKey}`);
      }

      console.log(
        `Fetching new events for user ${userId} near ${locationQuery}`
      );
      let newEvents = await this.fetchEventsFromGoogle(
        locationQuery,
        coordinates,
        50
      );

      if ((!newEvents || newEvents.length === 0) && location?.state) {
        console.log(
          `No events found for ${locationQuery}, trying state-level search: ${location.state}`
        );
        newEvents = await this.fetchEventsFromGoogle(location.state, null, 200);
      } else if (!newEvents || newEvents.length === 0) {
        console.log(
          `No events found for city or state. Trying pan-India search.`
        );
        newEvents = await this.fetchEventsFromGoogle("India", null, 1000);
      }

      const sixHoursLater = new Date(now.getTime() + 6 * 60 * 60 * 1000);
      const newCacheData = {
        location: location.city,
        locationQuery: locationQuery,
        events: newEvents,
        expiresAt: sixHoursLater,
        updatedAt: now,
      };

      await cacheDocRef.set(newCacheData);
      console.log(`Cached ${newEvents.length} events for ${locationKey}`);

      return newEvents;
    } catch (error) {
      console.error("Error in getNearbyEvents:", error);
      return [];
    }
  }
}

module.exports = new GoogleEventsService();
