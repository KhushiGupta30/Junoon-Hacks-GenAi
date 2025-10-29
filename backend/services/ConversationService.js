const { db } = require('../firebase');
const BaseService = require('./BaseService');

class ConversationService extends BaseService {
  constructor() {
    super('conversations');

    if (!db) {
      console.error("🔥 Firebase DB is undefined in ConversationService constructor");
      throw new Error("Firebase DB not initialized properly.");
    }
    this.collection = db.collection('conversations');
  }

  /**
   * Retrieves the chat history for a given user.
   * @param {string} userId The ID of the user.
   * @returns {Promise<Array>} The user's conversation history array.
   */
  async getHistory(userId) {
    try {
      if (!this.collection) {
        console.error("🔥 Firestore collection is undefined in getHistory()");
        throw new Error("Collection not initialized.");
      }

      const doc = await this.collection.doc(userId).get();
      if (!doc.exists) {
        console.log(`🆕 No conversation history found for user ${userId}`);
        return []; 
      }

      const data = doc.data();
      return data.messages || [];
    } catch (error) {
      console.error(`❌ Error getting history for user ${userId}:`, error);
      return [];
    }
  }

  /**
   * Saves or updates the chat history for a given user.
   * @param {string} userId The ID of the user.
   * @param {Array} history The complete conversation history array to save.
   */
  async saveHistory(userId, history) {
    try {
      if (!this.collection) {
        console.error("🔥 Firestore collection is undefined in saveHistory()");
        throw new Error("Collection not initialized.");
      }

      await this.collection.doc(userId).set(
        {
          messages: history,
          lastUpdatedAt: new Date(),
        },
        { merge: true }
      );

      console.log(`✅ Conversation history saved for user ${userId}`);
    } catch (error) {
      console.error(`❌ Error saving history for user ${userId}:`, error);
    }
  }
}

module.exports = new ConversationService();
