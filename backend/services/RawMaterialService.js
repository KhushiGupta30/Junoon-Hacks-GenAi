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

    const searchQuery = `${query.trim()} site:indiamart.com`;
    const params = {
      key: this.GOOGLE_API_KEY,
      cx: this.GOOGLE_CSE_ID,
      num: 10,
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

      // --- PARSE RESULTS (WITH NEW PRICE LOGIC) ---
      const materials = response.data.items
        .map((item) => {
          const image =
            item.pagemap?.cse_image?.[0]?.src ||
            'https://via.placeholder.com/300x200.png?text=No+Image';

          // --- THIS IS THE NEW LOGIC TO EXTRACT PRICE ---
          let price = null;
          // Google often puts pricing data in an "offer" object in the pagemap.
          const offer = item.pagemap?.offer?.[0];
          if (offer && offer.price) {
            // Check for currency, default to INR symbol '₹' if not specified.
            const currencySymbol = offer.pricecurrency === 'USD' ? '$' : '₹';
            // Clean up the price, removing "Get Latest Price" which sometimes appears.
            const cleanPrice = String(offer.price).replace(/[^0-9.,-]+/g, "");
            price = `${currencySymbol} ${cleanPrice}`;
          }
          // --- END OF NEW PRICE LOGIC ---

          return {
            title: item.title.replace('| IndiaMART', '').trim(),
            link: item.link,
            snippet: item.snippet?.replace(/[\n\t]+/g, ' ').trim() || '',
            source: item.displayLink,
            image,
            price: price, // Add the new price property to the object
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
      if (!forceRefresh) {
        const cacheDoc = await cacheDocRef.get();
        if (cacheDoc.exists) {
          const data = cacheDoc.data();
          const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

          if (data.updatedAt.toDate() > oneDayAgo) {
            console.log(`Returning cached materials for query: ${query}`);
            return data.materials;
          }
        }
      }

      const newMaterials = await this.fetchMaterials(query);

      await cacheDocRef.set({
        query,
        materials: newMaterials,
        // expiresAt: oneDayLater,
        updatedAt: now,
      });
      console.log(`Cached ${newMaterials.length} materials for query: ${query}`);

      return newMaterials;
    } catch (error) {
      console.error('Error in getMaterials:', error);
      return [];
    }
  }
}

module.exports = new RawMaterialService();