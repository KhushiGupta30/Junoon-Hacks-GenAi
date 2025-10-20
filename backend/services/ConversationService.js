const BaseService = require('./BaseService');

class ConversationService extends BaseService {
  constructor() {
    // We will store each user's conversation in a document named after their user ID.
    super('conversations');
  }

  /**
   * Retrieves the chat history for a given user.
   * @param {string} userId The ID of the user.
   * @returns {Promise<Array>} The user's conversation history array.
   */
  async getHistory(userId) {
    try {
      const doc = await this.collection.doc(userId).get();
      if (!doc.exists) {
        // If no history exists, return null or an empty array
        return null; 
      }
      // The history is stored in a 'messages' field within the document
      return doc.data().messages || [];
    } catch (error) {
      console.error(`Error getting history for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Saves or updates the chat history for a given user.
   * @param {string} userId The ID of the user.
   * @param {Array} history The complete conversation history array to save.
   */
  async saveHistory(userId, history) {
    try {
      // .set() with merge:true will create the document if it doesn't exist,
      // or update it if it does.
      await this.collection.doc(userId).set({
        messages: history,
        lastUpdatedAt: new Date(),
      }, { merge: true });
    } catch (error) {
      console.error(`Error saving history for user ${userId}:`, error);
      throw error;
    }
  }
}

module.exports = new ConversationService();