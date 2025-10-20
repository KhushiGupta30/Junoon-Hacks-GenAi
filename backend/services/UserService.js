const BaseService = require("./BaseService");
const bcrypt = require("bcryptjs");

class UserService extends BaseService {
  constructor() {
    super("users");
  }

  async create(userData) {
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 12);
    }

    return await super.create(userData);
  }

  async findByEmail(email) {
    return await this.findOne({ email });
  }

  async findByUID(firebaseUid) {
    return await this.findOne({ firebaseUid });
  }

  async comparePassword(user, candidatePassword) {
    if (!user.password) return false;
    return await bcrypt.compare(candidatePassword, user.password);
  }

  async updateLastActive(userId) {
    return await this.update(userId, {
      "stats.lastActive": new Date(),
    });
  }

  async updateProfile(userId, profileData) {
    return await this.update(userId, {
      profile: profileData,
      updatedAt: new Date(),
    });
  }

  static async updateArtisanProfile(userId, profileData) {
    if (!userId) {
      throw new Error("User ID is required to update a profile.");
    }
    const userRef = db.collection("users").doc(userId);
    await userRef.update(profileData);
    return { id: userId, ...profileData };
  }

  async updateInvestorProfile(userId, investorData) {
    return await this.update(userId, {
      investorProfile: investorData,
      updatedAt: new Date(),
    });
  }

  async updateAmbassadorProfile(userId, ambassadorData) {
    return await this.update(userId, {
      ambassadorProfile: ambassadorData,
      updatedAt: new Date(),
    });
  }

  async updateVerification(userId, verificationData) {
    return await this.update(userId, {
      verification: verificationData,
      updatedAt: new Date(),
    });
  }

  async updateSettings(userId, settingsData) {
    return await this.update(userId, {
      settings: settingsData,
      updatedAt: new Date(),
    });
  }

  async incrementProfileViews(userId) {
    const user = await this.findById(userId);
    if (user) {
      return await this.update(userId, {
        "stats.profileViews": (user.stats?.profileViews || 0) + 1,
      });
    }
    return null;
  }

  // Override toJSON to exclude password but keep firebaseUid for auth
  toJSON(user) {
    if (!user) return null;
    const userObj = { ...user };
    delete userObj.password;
    return userObj;
  }
}

module.exports = new UserService();
