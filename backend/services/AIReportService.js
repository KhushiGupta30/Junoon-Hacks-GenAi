// --- START OF FILE services/AIReportService.js ---

const BaseService = require('./BaseService');

class AIReportService extends BaseService {
  constructor() {
    super('ai_reports'); // This will be our new collection in Firestore
  }

  /**
   * Saves a newly generated report to the database.
   * Each report is a new document, creating a historical log.
   * @param {string} type - The type of report (e.g., 'trends', 'funding', 'insights').
   * @param {object} reportData - The JSON data of the report.
   * @param {string|null} userId - The user's ID for user-specific reports.
   */
  async saveReport(type, reportData, userId = null) {
    const reportDocument = {
      type,
      userId, // Will be null for general reports like 'trends'
      reportData,
      generatedAt: new Date(),
    };
    return await this.create(reportDocument);
  }

  /**
   * Gets the most recent report of a specific type.
   * @param {string} type - The type of report to find.
   * @param {string|null} userId - The user's ID for user-specific reports.
   * @returns {Promise<object|null>} The latest report document or null if not found.
   */
  async getLatestReport(type, userId = null) {
    try {
      let query = this.collection.where('type', '==', type);

      if (userId) {
        query = query.where('userId', '==', userId);
      }

      // Order by generation date in descending order and get the first one
      const snapshot = await query.orderBy('generatedAt', 'desc').limit(1).get();

      if (snapshot.empty) {
        return null;
      }

      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      console.error(`Error fetching latest report for type ${type}:`, error);
      throw error;
    }
  }

  /**
   * Checks if a report is still valid based on a 24-hour cache duration.
   * @param {Date} generatedAt - The timestamp when the report was generated.
   * @returns {boolean} - True if the report is less than 24 hours old.
   */
  isReportFresh(generatedAt) {
    if (!generatedAt) return false;
    
    // The 'generatedAt' from Firestore might be a Timestamp object, so convert to Date
    const generatedDate = generatedAt.toDate ? generatedAt.toDate() : new Date(generatedAt);
    
    const twentyFourHoursInMillis = 24 * 60 * 60 * 1000;
    const now = new Date();
    
    return (now.getTime() - generatedDate.getTime()) < twentyFourHoursInMillis;
  }
}

module.exports = new AIReportService();