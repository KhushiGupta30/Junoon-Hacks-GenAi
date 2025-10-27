// backend/services/GovernmentSchemesService.js
const { db } = require('../firebase');
const axios = require('axios');
// **FIX:** Remove the top-level import to break the circular dependency
// const userServiceInstance = require('./UserService');

class GovernmentSchemesService {
  constructor() {
    this.cacheCollection = db.collection('govt_schemes_cache');
    // **FIX:** Remove this line as well
    // this.userService = userServiceInstance;
    this.GOOGLE_API_KEY = process.env.GOOGLE_CSE_API_KEY;
    this.GOOGLE_CSE_ID = process.env.GOOGLE_CSE_ID;
  }

  /**
   * Fetches schemes from Google CSE.
   * @param {string} locationQuery - Location context (e.g., "Delhi" or "India")
   * @returns {Array} - Array of scheme objects
   */
  async fetchSchemesFromGoogle(locationQuery) {
    if (!this.GOOGLE_API_KEY || !this.GOOGLE_CSE_ID) {
      console.warn('Google CSE API Key or ID missing. Skipping scheme search.');
      return [];
    }

    // 1. --- Build Query ---
    // Query focused on artisans, handicrafts, loans, and grants in India
    const queryBase = `"government schemes for artisans India" OR "grants for handicrafts India" OR "Mudra loan for artisans" OR "PM Vishwakarma Scheme" OR "artisan credit card" OR "MSME schemes for handicraft"`;
    let query = `${queryBase} ${locationQuery || 'India'}`;

    // 2. --- Build API Params ---
    const params = {
      key: this.GOOGLE_API_KEY,
      cx: this.GOOGLE_CSE_ID,
      num: 3, // Get 10 results to filter from
      gl: 'in', // Geolocation bias for India
      cr: 'countryIN', // Restrict results to India
      q: query, // Assign the query
    };

    const url = `https://www.googleapis.com/customsearch/v1`;

    try {
      console.log(`Sending Google Search Query for schemes: ${params.q}`);
      const response = await axios.get(url, { params });

      if (!response.data.items) {
        console.log(`No Google Search results found for schemes.`);
        return [];
      }

      // 3. --- Parse and Format Results ---
      const schemes = response.data.items.map((item) => {
        const snippet = item.snippet.replace(/[\n\t]+/g, ' ').trim();
        return {
          title: item.title,
          link: item.link,
          snippet: snippet,
          source: item.displayLink,
        };
      });

      console.log(`Found ${schemes.length} raw scheme results.`);

      // 4. --- Filter for Uniqueness ---
      const uniqueSchemes = [];
      const seenTitles = new Set();

      for (const scheme of schemes) {
        const normalizedTitle = scheme.title
          .toLowerCase()
          .replace(/\|.*$/, '') // Remove text after a |
          .replace(/-.*$/, '') // Remove text after a -
          .replace(/^(pm|pradhan mantri)\s*/, '') // Remove common prefixes
          .trim();
        const simpleTitle = normalizedTitle.split(' ').slice(0, 4).join(' ');

        if (!seenTitles.has(simpleTitle)) {
          seenTitles.add(simpleTitle);
          uniqueSchemes.push(scheme);
        }
      }

      console.log(`Filtered down to ${uniqueSchemes.length} unique schemes.`);
      return uniqueSchemes; // Return the filtered list

    } catch (error) {
      console.error('Error fetching Google CSE for schemes:', error.response?.data?.error || error.message);
      if (error.response?.data) {
        console.error('API Error Details:', JSON.stringify(error.response.data, null, 2));
      }
      return [];
    }
  }

  /**
   * Gets schemes, from cache or by fetching new ones.
   * Caches based on state or "India" as a fallback.
   */
  async getGovernmentSchemes(userId, forceRefresh = false) {
    try {
      // **FIX:** Import UserService *inside* the function.
      // This delays the import and breaks the circular dependency loop.
      const userService = require('./UserService');

      let user;
      let location;
      
      if (userId) {
        try {
          // **FIX:** Use the locally required 'userService'
          user = await userService.findById(userId);
          location = user?.profile?.location;
        } catch (err) {
          console.error(`Failed to find user with ID: ${userId} while fetching schemes.`, err);
        }
      } else {
         console.warn(`No userId passed to getGovernmentSchemes. Defaulting to 'India' search.`);
      }

      const locationQuery = location?.state || 'India';
      const locationKey = (location?.state || 'india').toLowerCase().replace(/\s+/g, '_');
      const cacheDocRef = this.cacheCollection.doc(locationKey);
      const now = new Date();

      // 1. Check cache
      if (!forceRefresh) {
        const cacheDoc = await cacheDocRef.get();
        if (cacheDoc.exists) {
          const data = cacheDoc.data();
          const twelveHoursAgo = new Date(now.getTime() - 12 * 60 * 60 * 1000);

          const updatedAt = data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt);
            if (updatedAt > twelveHoursAgo){
            if (data.schemes && data.schemes.length > 0) {
              console.log(`Returning cached schemes for ${locationKey}`);
              return data.schemes;
            } else {
               console.log(`Cache valid but empty for ${locationKey}. Forcing refresh.`);
            }
          } else {
            console.log(`Cache expired for ${locationKey}`);
          }
        }
      } else {
        console.log(`Forcing cache refresh for ${locationKey}`);
      }

      // 2. Fetch new schemes
      console.log(`Fetching new schemes for ${locationQuery}`);
      const newSchemes = await this.fetchSchemesFromGoogle(locationQuery);

      // 3. Cache the new results
      const twelveHoursLater = new Date(now.getTime() + 12 * 60 * 60 * 1000);
      const newCacheData = {
        locationQuery: locationQuery,
        schemes: newSchemes,
        expiresAt: twelveHoursLater,
        updatedAt: now,
      };

      await cacheDocRef.set(newCacheData);
      console.log(`Cached ${newSchemes.length} schemes for ${locationKey}`);

      return newSchemes;

    } catch (error) {
      console.error('Error in getGovernmentSchemes:', error);
      return []; // Return empty on error
    }
  }
}

module.exports = new GovernmentSchemesService();

