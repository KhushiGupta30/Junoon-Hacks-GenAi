const BaseService = require("./BaseService");

class InvestmentService extends BaseService {
  constructor() {
    super("investments");
  }

  /**
   * Creates a new investment record and notifies the artisan.
   * @param {object} data - The investment data.
   * @param {string} data.investorId - The ID of the investor.
   * @param {string} data.investorName - The name of the investor.
   * @param {string} data.artisanId - The ID of the artisan receiving the investment.
   * @param {number} data.amount - The amount being invested.
   * @returns {Promise<object>} The newly created investment document.
   */
  static async create({ investorId, investorName, artisanId, amount }) {
    const investmentData = {
      investor: investorId,
      artisan: artisanId,
      amount: Number(amount),
      status: "completed", // Or 'pending' if you have an approval process
      createdAt: new Date(),
    };

    const newInvestment = await this.collection.add(investmentData);

    // Create a notification for the artisan
    await NotificationService.create({
      userId: artisanId,
      message: `Great news! You have received a new investment of $${amount} from ${investorName}.`,
      type: "new_investment",
      link: `/artisan/dashboard`, // Link to their dashboard or a specific investment page
    });

    return { id: newInvestment.id, ...investmentData };
  }

  async create(investmentData) {
    return await super.create({
      ...investmentData,
      fundingProgress: {
        amountRaised: 0,
        targetAmount: investmentData.amount,
        contributors: [],
      },
      repayment: {
        schedule: [],
        totalPaid: 0,
        remainingBalance: investmentData.amount,
      },
    });
  }

  async findByInvestor(investorId, options = {}) {
    return await this.findMany({ investor: investorId }, options);
  }

  async findByArtisan(artisanId, options = {}) {
    return await this.findMany({ artisan: artisanId }, options);
  }

  async findByStatus(status, options = {}) {
    return await this.findMany({ status }, options);
  }

  async findByType(type, options = {}) {
    return await this.findMany({ type }, options);
  }

  async addContribution(investmentId, contributionData) {
    const investment = await this.findById(investmentId);
    if (!investment) {
      throw new Error("Investment not found");
    }

    const contributors = investment.fundingProgress?.contributors || [];
    contributors.push({
      ...contributionData,
      date: new Date(),
    });

    const newAmountRaised =
      (investment.fundingProgress?.amountRaised || 0) + contributionData.amount;

    return await this.update(investmentId, {
      "fundingProgress.contributors": contributors,
      "fundingProgress.amountRaised": newAmountRaised,
    });
  }

  async updateStatus(investmentId, status) {
    return await this.update(investmentId, { status });
  }

  async addRepaymentSchedule(investmentId, schedule) {
    const investment = await this.findById(investmentId);
    if (!investment) {
      throw new Error("Investment not found");
    }

    const repaymentSchedule = investment.repayment?.schedule || [];
    repaymentSchedule.push(...schedule);

    return await this.update(investmentId, {
      "repayment.schedule": repaymentSchedule,
    });
  }

  async recordRepayment(investmentId, amount, dueDate) {
    const investment = await this.findById(investmentId);
    if (!investment) {
      throw new Error("Investment not found");
    }

    const schedule = investment.repayment?.schedule || [];
    const paymentIndex = schedule.findIndex(
      (payment) => payment.dueDate.toDate().getTime() === dueDate.getTime()
    );

    if (paymentIndex === -1) {
      throw new Error("Payment schedule entry not found");
    }

    const updatedSchedule = [...schedule];
    updatedSchedule[paymentIndex] = {
      ...updatedSchedule[paymentIndex],
      amount,
      paidDate: new Date(),
      status: "paid",
    };

    const totalPaid = (investment.repayment?.totalPaid || 0) + amount;
    const remainingBalance = Math.max(0, investment.amount - totalPaid);

    return await this.update(investmentId, {
      "repayment.schedule": updatedSchedule,
      "repayment.totalPaid": totalPaid,
      "repayment.remainingBalance": remainingBalance,
    });
  }

  async addUpdate(investmentId, updateData) {
    const investment = await this.findById(investmentId);
    if (!investment) {
      throw new Error("Investment not found");
    }

    const updates = investment.updates || [];
    updates.push({
      ...updateData,
      date: new Date(),
    });

    return await this.update(investmentId, { updates });
  }

  async getInvestmentStats(investorId = null) {
    let filter = {};
    if (investorId) {
      filter.investor = investorId;
    }

    const investments = await this.findMany(filter);

    return {
      totalInvestments: investments.length,
      activeInvestments: investments.filter((i) => i.status === "active")
        .length,
      completedInvestments: investments.filter((i) => i.status === "completed")
        .length,
      totalInvested: investments.reduce((sum, inv) => sum + inv.amount, 0),
      totalReturns: investments
        .filter((i) => i.status === "completed")
        .reduce((sum, inv) => sum + (inv.terms?.expectedReturns || 0), 0),
    };
  }

  async getArtisanInvestmentStats(artisanId) {
    const investments = await this.findByArtisan(artisanId);

    return {
      totalInvestments: investments.length,
      totalFunding: investments.reduce((sum, inv) => sum + inv.amount, 0),
      activeInvestments: investments.filter((i) => i.status === "active")
        .length,
      completedInvestments: investments.filter((i) => i.status === "completed")
        .length,
    };
  }

  async checkFundingGoal(investmentId) {
    const investment = await this.findById(investmentId);
    if (!investment) {
      throw new Error("Investment not found");
    }

    const amountRaised = investment.fundingProgress?.amountRaised || 0;
    const targetAmount =
      investment.fundingProgress?.targetAmount || investment.amount;

    return {
      amountRaised,
      targetAmount,
      percentage: (amountRaised / targetAmount) * 100,
      isFullyFunded: amountRaised >= targetAmount,
    };
  }
}

module.exports = new InvestmentService();
