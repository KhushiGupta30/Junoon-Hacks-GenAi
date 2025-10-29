const BaseService = require("./BaseService");

class ConversationService extends BaseService {
  constructor() {
    super("conversations");
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
        return null;
      }
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
      await this.collection.doc(userId).set(
        {
          messages: history,
          lastUpdatedAt: new Date(),
        },
        { merge: true }
      );
    } catch (error) {
      console.error(`Error saving history for user ${userId}:`, error);
      throw error;
    }
  }
}

module.exports = new ConversationService();
