// backend/services/GoogleEventsService.js
const { db } = require('../firebase');
const axios = require('axios');
// Import the INSTANCE of UserService, not the class
const userServiceInstance = require('./UserService');

class GoogleEventsService {
  constructor() {
    this.cacheCollection = db.collection('nearby_events_cache');
    // Assign the imported instance directly
    this.userService = userServiceInstance;
    this.GOOGLE_API_KEY = process.env.GOOGLE_CSE_API_KEY;
    this.GOOGLE_CSE_ID = process.env.GOOGLE_CSE_ID;
  }

  /**
   * Parse date from snippet with better handling
   */
  parseEventDate(snippet) {
    // Try multiple date formats
    const patterns = [
      // Month Day formats: "Oct 26", "October 26th"
      /\b(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+(\d{1,2})(?:st|nd|rd|th)?\b/i,
      // ISO dates: "2025-10-26"
      /\b(\d{4})-(\d{2})-(\d{2})\b/,
      // US dates: "10/26/2025" or "10/26/25"
      /\b(\d{1,2})\/(\d{1,2})\/(\d{2,4})\b/,
      // Date ranges: "Oct 26-28", "Nov 1-3"
      /\b(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+(\d{1,2})(?:st|nd|rd|th)?[-–](\d{1,2})(?:st|nd|rd|th)?\b/i
    ];

    for (const pattern of patterns) {
      const match = snippet.match(pattern);
      if (match) {
        return match[0];
      }
    }

    return 'Date not specified';
  }

  /**
   * Get current date in YYYYMMDD format for CSE date filtering
   */
  getDateString(daysOffset = 0) {
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  }

  /**
   * Fetches events from Google CSE API with proper filtering
   */
  async fetchEventsFromGoogle(locationQuery) {
    if (!this.GOOGLE_API_KEY || !this.GOOGLE_CSE_ID) {
      console.warn('Google CSE API Key or ID is not set. Skipping event search.');
      return [];
    }

    // Build a more targeted query
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.toLocaleString('en-US', { month: 'long' });
    
    // Create a search query that's more likely to find upcoming events
    const query = `"art exhibition" OR "craft fair" OR "artisan market" OR "maker fair" ${currentMonth} ${currentYear} ${locationQuery}`;
    
    const url = 'https://www.googleapis.com/customsearch/v1';

    try {
      const response = await axios.get(url, {
        params: {
          key: this.GOOGLE_API_KEY,
          cx: this.GOOGLE_CSE_ID,
          q: query,
          num: 10, // Get more results to filter from
          // Sort by date (most recent first)
          sort: 'date',
          // Use date restrict to get recent content (last 90 days)
          dateRestrict: 'm3', // m3 = last 3 months
          // Alternative: use exact date range
          // sort: `date:r:${this.getDateString()}:${this.getDateString(90)}`,
        },
      });

      if (!response.data.items) {
        console.log('No search results found');
        return [];
      }

      // Parse and format results
      const events = response.data.items
        .map((item) => {
          const snippet = item.snippet.replace(/[\n\t]+/g, ' ').trim();
          const date = this.parseEventDate(snippet);
          
          return {
            title: item.title,
            link: item.link,
            snippet: snippet,
            source: item.displayLink,
            date: date,
            // Include page map data if available (some sites provide structured data)
            ...(item.pagemap?.event?.[0] && {
              structuredDate: item.pagemap.event[0].startdate,
              location: item.pagemap.event[0].location,
            }),
          };
        })
        // Filter out events that are clearly in the past
        .filter(event => {
          // If we found "Date not specified", keep it (might be upcoming)
          if (event.date === 'Date not specified') return true;
          
          // Basic filtering: if date string contains current or future month names
          const futureMonths = this.getUpcomingMonthNames(3);
          return futureMonths.some(month => 
            event.date.toLowerCase().includes(month.toLowerCase())
          );
        })
        // Limit to 5 best results
        .slice(0, 5);

      console.log(`Found ${events.length} events for ${locationQuery}`);
      return events;
      
    } catch (error) {
      console.error(
        'Error fetching Google CSE:',
        error.response?.data?.error || error.message
      );
      
      // Log more details for debugging
      if (error.response?.data) {
        console.error('API Error Details:', JSON.stringify(error.response.data, null, 2));
      }
      
      return [];
    }
  }

  /**
   * Helper to get upcoming month names for filtering
   */
  getUpcomingMonthNames(count = 3) {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const today = new Date();
    const currentMonth = today.getMonth();
    const upcomingMonths = [];
    
    for (let i = 0; i < count; i++) {
      const monthIndex = (currentMonth + i) % 12;
      upcomingMonths.push(months[monthIndex]);
    }
    
    return upcomingMonths;
  }

  /**
   * Gets nearby events, from cache or by fetching new ones
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
          console.log(`Returning cached events for ${location.city}`);
          return data.events;
        }
      }

      // 2. Cache is stale or non-existent, fetch new events
      const locationQuery = `${location.city}${location.state ? ', ' + location.state : ''}`;
      console.log(`Fetching new events for: ${locationQuery}`);
      
      const newEvents = await this.fetchEventsFromGoogle(locationQuery);

      // 3. Cache the new results (24 hour cache)
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const newCacheData = {
        location: location.city,
        locationQuery: locationQuery,
        events: newEvents,
        expiresAt: tomorrow,
        updatedAt: now,
      };

      await cacheDocRef.set(newCacheData);
      console.log(`Cached ${newEvents.length} events for ${location.city}`);
      
      return newEvents;
      
    } catch (error) {
      console.error('Error in getNearbyEvents:', error);
      throw new Error('Could not retrieve nearby events.');
    }
  }
}

module.exports = new GoogleEventsService();