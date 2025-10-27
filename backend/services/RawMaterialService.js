// backend/services/RawMaterialService.js
const { db } = require('../firebase');
const axios = require('axios');

class RawMaterialService {
  constructor() {
    this.cacheCollection = db.collection('raw_materials_cache');
    this.GOOGLE_API_KEY = process.env.GOOGLE_CSE_API_KEY;
    this.GOOGLE_CSE_ID = process.env.GOOGLE_CSE_ID;
  }

  /**
   * Fetches raw materials from Google CSE, restricted to indiamart.com
   * @param {string} query - The search query (e.g., "cotton thread", "terracotta clay")
   * @returns {Array} - Array of material listing objects
   */
  async fetchMaterials(query) {
    if (!this.GOOGLE_API_KEY || !this.GOOGLE_CSE_ID) {
      console.warn('Google CSE API Key or ID missing. Skipping material search.');
      return [];
    }

    // --- Build Query ---
    // Removed artisan/craft terms for simpler IndiaMART-focused results.
    // Also removed quotes to avoid INVALID_ARGUMENT errors from Google CSE.
    const searchQuery = `${query.trim()} site:indiamart.com`;

    // --- Build API Params ---
    const params = {
      key: this.GOOGLE_API_KEY,
      cx: this.GOOGLE_CSE_ID,
      num: 10, // number of results
    //   gl: 'in',
    //   cr: 'countryIN',
      q: searchQuery,
    };

    const url = 'https://www.googleapis.com/customsearch/v1';

    try {
      console.log(`Sending Google Search Query for materials: ${params.q}`);
      const response = await axios.get(url, { params });

      if (!response.data.items) {
        console.log(`No IndiaMART results found for: ${query}`);
        return [];
      }

      // --- Parse results ---
      const materials = response.data.items
        .map((item) => {
          const image =
            item.pagemap?.cse_image?.[0]?.src ||
            'https://via.placeholder.com/300x200.png?text=No+Image';

          return {
            title: item.title.replace('| IndiaMART', '').trim(),
            link: item.link,
            snippet: item.snippet?.replace(/[\n\t]+/g, ' ').trim() || '',
            source: item.displayLink,
            image,
          };
        })
        .filter((item) => item.link.includes('indiamart.com'));

      console.log(`Found ${materials.length} relevant materials.`);
      return materials;
    } catch (error) {
      const errData = error.response?.data?.error || error.message;
      console.error('Error fetching Google CSE for materials:', errData);
      if (error.response?.data) {
        console.error('API Error Details:', JSON.stringify(error.response.data, null, 2));
      }
      return [];
    }
  }

  /**
   * Gets materials, from cache or by fetching new ones.
   * The cache key is the search query itself.
   */
  async getMaterials(query, forceRefresh = false) {
    if (!query) {
      console.error('No query provided for material search.');
      return [];
    }

    const cacheKey = query.toLowerCase().replace(/\s+/g, '_');
    const cacheDocRef = this.cacheCollection.doc(cacheKey);
    const now = new Date();

    try {
      // --- Check cache ---
      if (!forceRefresh) {
        const cacheDoc = await cacheDocRef.get();
        if (cacheDoc.exists) {
          const data = cacheDoc.data();
          const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

          if (data.updatedAt.toDate() > oneDayAgo) {
            console.log(`Returning cached materials for query: ${query}`);
            return data.materials;
          } else {
            console.log(`Cache expired for query: ${query}`);
          }
        }
      } else {
        console.log(`Forcing cache refresh for query: ${query}`);
      }

      // --- Fetch new materials ---
      console.log(`Fetching new materials for query: ${query}`);
      const newMaterials = await this.fetchMaterials(query);

      // --- Cache the new results ---
      const oneDayLater = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const newCacheData = {
        query,
        materials: newMaterials,
        expiresAt: oneDayLater,
        updatedAt: now,
      };

      await cacheDocRef.set(newCacheData);
      console.log(`Cached ${newMaterials.length} materials for query: ${query}`);

      return newMaterials;
    } catch (error) {
      console.error('Error in getMaterials:', error);
      return [];
    }
  }
}

module.exports = new RawMaterialService();
