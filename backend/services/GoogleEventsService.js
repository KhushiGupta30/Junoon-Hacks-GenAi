// backend/services/GoogleEventsService.js
const { db } = require('../firebase');
const axios = require('axios');
const UserService = require('./UserService'); //

// A simple regex to find dates like "Oct 26", "Nov 1-3", "2025-10-26"
const dateRegex =
  /(\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2}(st|nd|rd|th)?(-\d{1,2})?\b)|(\d{4}-\d{2}-\d{2})|(\d{1,2}\/\d{1,2}\/\d{2,4})/;

class GoogleEventsService {
  constructor() {
    this.cacheCollection = db.collection('nearby_events_cache');
    this.userService = new UserService();
    this.GOOGLE_API_KEY = process.env.GOOGLE_CSE_API_KEY; // Requires .env variable
    this.GOOGLE_CSE_ID = process.env.GOOGLE_CSE_ID; // Requires .env variable
  }

  /**
   * Tries to extract a date from an event snippet.
   */
  parseEventDate(snippet) {
    const match = snippet.match(dateRegex);
    return match ? match[0] : 'Date not specified';
  }

  /**
   * Fetches events from Google CSE API.
   */
  async fetchEventsFromGoogle(locationQuery) {
    if (!this.GOOGLE_API_KEY || !this.GOOGLE_CSE_ID) {
      console.warn(
        'Google CSE API Key or ID is not set. Skipping event search.'
      );
      return [];
    }

    const query = `art exhibitions, craft fairs, or artist workshops in ${locationQuery}`;
    const url = `https://www.googleapis.com/customsearch/v1`;

    try {
      const response = await axios.get(url, {
        params: {
          key: this.GOOGLE_API_KEY,
          cx: this.GOOGLE_CSE_ID,
          q: query,
          num: 5, // Limit to 5 results
        },
      });

      if (!response.data.items) {
        return [];
      }

      // Parse and format results
      const events = response.data.items.map((item) => ({
        title: item.title,
        link: item.link,
        snippet: item.snippet.replace(/[\n\t]+/g, ' ').trim(),
        source: item.displayLink,
        // Try to get a date from the snippet
        date: this.parseEventDate(item.snippet),
      }));

      return events;
    } catch (error) {
      console.error(
        'Error fetching Google CSE:',
        error.response?.data?.error || error.message
      );
      return [];
    }
  }

  /**
   * Gets nearby events, from cache or by fetching new ones.
   */
  async getNearbyEvents(userId) {
    const user = await this.userService.findById(userId);
    const location = user?.profile?.location;

    if (!location || !location.city) {
      throw new Error('User location is not set.');
    }

    const locationKey = location.city.toLowerCase().replace(/\s+/g, '_');
    const cacheDocRef = this.cacheCollection.doc(locationKey);
    const now = new Date();

    try {
      // 1. Check cache
      const cacheDoc = await cacheDocRef.get();
      if (cacheDoc.exists) {
        const data = cacheDoc.data();
        if (data.expiresAt.toDate() > now) {
          // Cache is fresh, return cached events
          return data.events;
        }
      }

      // 2. Cache is stale or non-existent, fetch new events
      const locationQuery = `${location.city}, ${location.state || ''}`;
      const newEvents = await this.fetchEventsFromGoogle(locationQuery);

      // 3. Cache the new results
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hour cache
      const newCacheData = {
        location: location.city,
        events: newEvents,
        expiresAt: tomorrow,
        updatedAt: now,
      };

      await cacheDocRef.set(newCacheData);
      return newEvents;
    } catch (error) {
      console.error('Error in getNearbyEvents:', error);
      throw new Error('Could not retrieve nearby events.');
    }
  }
}

module.exports = new GoogleEventsService();