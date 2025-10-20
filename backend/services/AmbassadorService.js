// File: backend/services/AmbassadorService.js
const BaseService = require('./BaseService');

class AmbassadorService extends BaseService {
  constructor() {
    // This will create/use a 'ambassadorApplications' collection in Firestore
    super('ambassadorApplications');
  }

  /**
   * Creates a new ambassador application record.
   * @param {object} applicationData - The data from the application form.
   * @returns {Promise<object>} The newly created application object.
   */
  async createApplication(applicationData) {
    const dataToSave = {
      ...applicationData,
      status: 'pending', // Default status for new applications
      submittedAt: new Date(),
    };
    return await this.create(dataToSave);
  }
}

module.exports = new AmbassadorService();