// backend/services/GoogleEventsService.js
const { db } = require('../firebase');
const axios = require('axios');
// Import the INSTANCE of UserService
const userServiceInstance = require('./UserService');

// Regex to find dates
const dateRegex =
  /(\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2}(st|nd|rd|th)?(-\d{1,2}(?:st|nd|rd|th)?)?\b)|(\d{4}-\d{2}-\d{2})|(\d{1,2}\/\d{1,2}\/\d{2,4})/;

class GoogleEventsService {
  constructor() {
    this.cacheCollection = db.collection('nearby_events_cache');
    this.userService = userServiceInstance;
    this.GOOGLE_API_KEY = process.env.GOOGLE_CSE_API_KEY;
    this.GOOGLE_CSE_ID = process.env.GOOGLE_CSE_ID;
  }

  parseEventDate(snippet) {
    const match = snippet.match(dateRegex);
    return match ? match[0].replace(/[,.]+$/, '').trim() : 'Date not specified';
  }

  /**
   * Fetches events from Google CSE using coordinate-based search.
   * @param {string} locationQuery - Fallback text query (e.g., "New Delhi, Delhi")
   * @param {object} coordinates - User's coordinates { latitude, longitude }
   * @param {number} radiusKm - Search radius in kilometers
   * @returns {Array} - Array of event objects
   */
  async fetchEventsFromGoogle(locationQuery, coordinates = null, radiusKm = 50) {
    if (!this.GOOGLE_API_KEY || !this.GOOGLE_CSE_ID) {
      console.warn('Google CSE API Key or ID missing. Skipping event search.');
      return [];
    }

    // 1. --- Build Base Query ---
    const queryBase = `"craft fair" OR "art exhibition" OR "handicraft mela" OR "makers market" OR "handloom exhibition" OR "artisan market"`;
    let query = ""; // This will be set below

    // 2. --- Build API Params ---
    const params = {
      key: this.GOOGLE_API_KEY,
      cx: this.GOOGLE_CSE_ID,
      num: 10, // Request 10 results
      gl: 'in', // Geolocation bias for India
      cr: 'countryIN', // Restrict results to India
      sort: 'date', // Sort by date to find RECENT events
    };

    // 3. --- Add Location to Query ---
    if (coordinates && coordinates.latitude && coordinates.longitude) {
      // **PRIORITY:** Use coordinates with a radius. This is the BEST method.
      // Format: more:p:location:LAT:LONG:RADIUSkm
      const locationFilter = `more:p:location:${coordinates.latitude}:${coordinates.longitude}:${radiusKm}km`;
      query = `${queryBase} ${locationFilter}`;
      console.log(`Using coordinates in query: ${locationFilter}`);
    } else if (locationQuery) {
      // **FALLBACK:** Add city/state as simple keywords.
      query = `${queryBase} ${locationQuery}`;
      console.log(`Using location query: ${locationQuery}`);
    } else {
      console.warn('No location or coordinates provided for event search.');
      return [];
    }

    // **CRITICAL FIX:** Assign the built query string to the params object
    params.q = query;

    const url = `https://www.googleapis.com/customsearch/v1`;

    try {
      console.log(`Sending Google Search Query: ${params.q}`);
      const response = await axios.get(url, { params });

      if (!response.data.items) {
        console.log(`No Google Search results found.`);
        return [];
      }

      // 4. --- REMOVE RESTRICTIVE FILTER ---
      // We now trust Google's location parameters (gl, cr, more:p:location),
      // which are more accurate than snippet-matching.
      const events = response.data.items
        .map((item) => {
          const snippet = item.snippet.replace(/[\n\t]+/g, ' ').trim();
          return {
            title: item.title,
            link: item.link,
            snippet: snippet,
            source: item.displayLink,
            date: this.parseEventDate(snippet),
          };
        })
        .filter(event => event !== null); // Keep filter for nulls

      console.log(`Found ${events.length} potentially relevant events.`);
      return events;

    } catch (error) {
      console.error('Error fetching Google CSE:', error.response?.data?.error || error.message);
      if (error.response?.data) {
        console.error('API Error Details:', JSON.stringify(error.response.data, null, 2));
      }
      return [];
    }
  }

  /**
   * Gets nearby events, from cache or by fetching new ones.
   */
  async getNearbyEvents(userId, forceRefresh = false) {
    // Correctly use the userService instance
    const user = await this.userService.findById(userId); // Use instance method
    const location = user?.profile?.location;
    // Get coordinates
    const coordinates = user?.coordinates; // Assumes structure { latitude: number, longitude: number }

    // Need at least a city for fallback and cache key
    if (!location || !location.city) {
      console.error(`User ${userId} location (city) is not set.`);
      return []; // Return empty instead of throwing error
    }

    // Build location string for fallback query and cache key
    const locationQuery = `${location.city}${location.state ? ', ' + location.state : ''}`;
    const locationKey = `${location.city}${location.state ? '_' + location.state : ''}`
      .toLowerCase()
      .replace(/\s+/g, '_');

    const cacheDocRef = this.cacheCollection.doc(locationKey);
    const now = new Date();

    try {
      // 1. Check cache (cache still based on city/state key)
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

      // 2. Fetch new events, passing coordinates and default radius
      console.log(`Fetching new events for user ${userId} near ${locationQuery}`);
      // Use default radius (e.g., 50km) for the primary, coordinate-based search
      let newEvents = await this.fetchEventsFromGoogle(locationQuery, coordinates, 50);

      // --- Extended Search Logic (FIXED) ---
      // If no city-level results, broaden search to state
      if ((!newEvents || newEvents.length === 0) && location?.state) {
        console.log(`No events found for ${locationQuery}, trying state-level search: ${location.state}`);
        // Pass state as query, NULL for coordinates (to force keyword search), and a larger radius
        newEvents = await this.fetchEventsFromGoogle(location.state, null, 200);
      }

      // *** USE ELSE IF ***
      // If still no results, try pan-India
      else if ((!newEvents || newEvents.length === 0)) {
        console.log(`No events found for city or state. Trying pan-India search.`);
        // Pass "India" as query, NULL for coordinates, and a very large radius
        newEvents = await this.fetchEventsFromGoogle("India", null, 1000);
      }

      // 3. Cache the new results
      const sixHoursLater = new Date(now.getTime() + 6 * 60 * 60 * 1000);
      const newCacheData = {
        location: location.city,
        locationQuery: locationQuery, // Store the query used for context
        events: newEvents,
        expiresAt: sixHoursLater,
        updatedAt: now,
      };

      await cacheDocRef.set(newCacheData);
      console.log(`Cached ${newEvents.length} events for ${locationKey}`);

      return newEvents;

    } catch (error) {
      console.error('Error in getNearbyEvents:', error);
      return []; // Return empty on error
    }
  }
}

module.exports = new GoogleEventsService();