const BaseService = require('./BaseService');

class IdeaService extends BaseService {
  constructor() {
    super('ideas');
  }

  async create(ideaData) {
    return await super.create({
      ...ideaData,
      votes: {
        upvotes: 0,
        downvotes: 0,
        voters: []
      }
    });
  }

  async findPublished(filters = {}, options = {}) {
    return await this.findMany({ ...filters, status: 'published' }, options);
  }

  async findByArtisan(artisanId, options = {}) {
    return await this.findMany({ artisan: artisanId }, options);
  }

  async findByCategory(category, options = {}) {
    return await this.findMany({ category }, options);
  }

  async addVote(ideaId, userId, voteType) {
    const idea = await this.findById(ideaId);
    if (!idea) {
      throw new Error('Idea not found');
    }

    const voters = idea.votes?.voters || [];
    const existingVoteIndex = voters.findIndex(voter => voter.user === userId);

    let newVoters = [...voters];
    let upvotes = idea.votes?.upvotes || 0;
    let downvotes = idea.votes?.downvotes || 0;

    if (existingVoteIndex !== -1) {
      const existingVote = voters[existingVoteIndex];
      
      // Remove old vote counts
      if (existingVote.vote === 'up') {
        upvotes -= 1;
      } else {
        downvotes -= 1;
      }

      // Update existing vote
      newVoters[existingVoteIndex] = {
        user: userId,
        vote: voteType,
        date: new Date()
      };
    } else {
      // Add new vote
      newVoters.push({
        user: userId,
        vote: voteType,
        date: new Date()
      });
    }

    // Add new vote counts
    if (voteType === 'up') {
      upvotes += 1;
    } else {
      downvotes += 1;
    }

    return await this.update(ideaId, {
      votes: {
        upvotes,
        downvotes,
        voters: newVoters
      }
    });
  }

  async removeVote(ideaId, userId) {
    const idea = await this.findById(ideaId);
    if (!idea) {
      throw new Error('Idea not found');
    }

    const voters = idea.votes?.voters || [];
    const voteIndex = voters.findIndex(voter => voter.user === userId);

    if (voteIndex === -1) {
      throw new Error('Vote not found');
    }

    const voteToRemove = voters[voteIndex];
    const newVoters = voters.filter((_, index) => index !== voteIndex);

    let upvotes = idea.votes?.upvotes || 0;
    let downvotes = idea.votes?.downvotes || 0;

    // Remove vote counts
    if (voteToRemove.vote === 'up') {
      upvotes -= 1;
    } else {
      downvotes -= 1;
    }

    return await this.update(ideaId, {
      votes: {
        upvotes,
        downvotes,
        voters: newVoters
      }
    });
  }

  async addComment(ideaId, commentData) {
    const idea = await this.findById(ideaId);
    if (!idea) {
      throw new Error('Idea not found');
    }

    const comments = idea.comments || [];
    comments.push({
      ...commentData,
      date: new Date(),
      likes: 0
    });

    return await this.update(ideaId, { comments });
  }

  async updateComment(ideaId, commentIndex, commentData) {
    const idea = await this.findById(ideaId);
    if (!idea || !idea.comments || !idea.comments[commentIndex]) {
      throw new Error('Comment not found');
    }

    const comments = [...idea.comments];
    comments[commentIndex] = {
      ...comments[commentIndex],
      ...commentData,
      date: new Date()
    };

    return await this.update(ideaId, { comments });
  }

  async deleteComment(ideaId, commentIndex) {
    const idea = await this.findById(ideaId);
    if (!idea || !idea.comments || !idea.comments[commentIndex]) {
      throw new Error('Comment not found');
    }

    const comments = [...idea.comments];
    comments.splice(commentIndex, 1);

    return await this.update(ideaId, { comments });
  }

  async addPreOrder(ideaId, preOrderData) {
    const idea = await this.findById(ideaId);
    if (!idea) {
      throw new Error('Idea not found');
    }

    const preOrders = idea.preOrders || [];
    preOrders.push({
      ...preOrderData,
      date: new Date()
    });

    return await this.update(ideaId, { preOrders });
  }

  async getVoteScore(ideaId) {
    const idea = await this.findById(ideaId);
    if (!idea) {
      throw new Error('Idea not found');
    }

    const upvotes = idea.votes?.upvotes || 0;
    const downvotes = idea.votes?.downvotes || 0;
    return upvotes - downvotes;
  }

  async getTotalVotes(ideaId) {
    const idea = await this.findById(ideaId);
    if (!idea) {
      throw new Error('Idea not found');
    }

    const upvotes = idea.votes?.upvotes || 0;
    const downvotes = idea.votes?.downvotes || 0;
    return upvotes + downvotes;
  }
}

module.exports = new IdeaService();
