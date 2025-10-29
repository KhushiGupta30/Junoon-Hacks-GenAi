const { db } = require("../firebase");

class DiscussionService {
  static async _getUserDetails(userId) {
    if (!userId) {
      return { name: "Anonymous" };
    }
    const userDoc = await db.collection("users").doc(userId).get();
    if (!userDoc.exists) return { name: "Unknown User" };
    return { id: userDoc.id, ...userDoc.data() };
  }

  static async getAllDiscussions() {
    const snapshot = await db
      .collection("discussions")
      .orderBy("createdAt", "desc")
      .get();
    const discussions = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const data = doc.data();
        const authorDetails = await this._getUserDetails(data.author);
        return {
          _id: doc.id,
          title: data.title,
          author: { name: authorDetails.name },
          createdAt: data.createdAt,
        };
      })
    );
    return discussions;
  }

  static async getDiscussionById(id) {
    const doc = await db.collection("discussions").doc(id).get();
    if (!doc.exists) throw new Error("Discussion not found");

    const data = doc.data();
    const authorDetails = await this._getUserDetails(data.author);

    const repliesSnapshot = await db
      .collection("replies")
      .where("discussion", "==", id)
      .orderBy("createdAt", "asc")
      .get();
    const replies = await Promise.all(
      repliesSnapshot.docs.map(async (replyDoc) => {
        const replyData = replyDoc.data();
        const replyAuthor = await this._getUserDetails(replyData.author);
        return {
          _id: replyDoc.id,
          content: replyData.content,
          author: { name: replyAuthor.name },
        };
      })
    );

    return {
      _id: doc.id,
      ...data,
      author: { name: authorDetails.name },
      replies,
    };
  }

  static async createDiscussion(title, content, authorId) {
    const newDiscussion = {
      title,
      content,
      author: authorId,
      createdAt: new Date().toISOString(),
    };
    const docRef = await db.collection("discussions").add(newDiscussion);
    const authorDetails = await this._getUserDetails(authorId);
    return {
      _id: docRef.id,
      ...newDiscussion,
      author: { name: authorDetails.name },
    };
  }

  static async addReplyToDiscussion(discussionId, content, authorId) {
    const newReply = {
      content,
      author: authorId,
      discussion: discussionId,
      createdAt: new Date().toISOString(),
    };
    const replyRef = await db.collection("replies").add(newReply);
    const authorDetails = await this._getUserDetails(authorId);
    return {
      _id: replyRef.id,
      ...newReply,
      author: { name: authorDetails.name },
    };
  }
}

module.exports = DiscussionService;
