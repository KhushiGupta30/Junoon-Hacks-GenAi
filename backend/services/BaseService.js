const { db } = require("../firebase.js");
const { FieldValue } = require("firebase-admin/firestore");

class BaseService {
  constructor(collectionName) {
    this.collectionName = collectionName;
    this.collectionRef = db.collection(collectionName);
  }

  /**
   * --- CORRECTED ---
   * Uses Firebase Admin SDK syntax
   */
  async create(data) {
    try {
      const timestamp = FieldValue.serverTimestamp();
      const docRef = await this.collectionRef.add({
        ...data,
        createdAt: timestamp,
        updatedAt: timestamp,
      });
      const docSnap = await docRef.get();
      return { id: docSnap.id, ...docSnap.data() };
    } catch (error) {
      console.error(`Error in create for ${this.collectionName}:`, error);
      throw new Error(`Error creating document: ${error.message}`);
    }
  }

  async findById(id) {
    try {
      const docRef = this.collectionRef.doc(id);
      const docSnap = await docRef.get();

      if (docSnap.exists) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        console.warn(
          `No document found with id ${id} in ${this.collectionName}`
        );
        return null;
      }
    } catch (error) {
      console.error(`Error in findById for ${this.collectionName}:`, error);
      throw new Error(`Error finding document: ${error.message}`);
    }
  }

  async findOne(filters) {
    try {
      let query = this.collectionRef;

      Object.keys(filters).forEach((key) => {
        query = query.where(key, "==", filters[key]);
      });

      const snapshot = await query.limit(1).get();

      if (snapshot.empty) {
        return null;
      }

      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      console.error(`Error in findOne for ${this.collectionName}:`, error);
      throw new Error(`Error finding document: ${error.message}`);
    }
  }

  async findMany(filters = {}, options = {}) {
    try {
      let query = this.collectionRef;

      for (const key of Object.keys(filters)) {
        if (key === "price" && typeof filters[key] === "object") {
          if (filters[key].$gte !== undefined) {
            query = query.where("price", ">=", filters[key].$gte);
          }
          if (filters[key].$lte !== undefined) {
            query = query.where("price", "<=", filters[key].$lte);
          }
          continue;
        }

        if (key === "$text") {
          continue;
        }

        if (
          typeof filters[key] === "object" &&
          filters[key].in &&
          Array.isArray(filters[key].in)
        ) {
          query = query.where(key, "in", filters[key].in);
          continue;
        }
        query = query.where(key, "==", filters[key]);
      }

      if (options.sortBy) {
        const direction = options.sortOrder === "asc" ? "asc" : "desc";
        query = query.orderBy(options.sortBy, direction);
      }

      if (options.limit) {
        query = query.limit(options.limit);
      }
      if (options.offset) {
        query = query.offset(options.offset);
      }

      try {
        const snapshot = await query.get();
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      } catch (err) {
        const needsIndex =
          typeof err?.message === "string" &&
          (err.message.toLowerCase().includes("index") ||
            err.message.toLowerCase().includes("order by"));

        if (needsIndex && options.sortBy) {
          console.warn(
            `Firestore query failed, likely missing index. Retrying without sorting for ${this.collectionName}. Error: ${err.message}`
          );
          let fallbackQuery = this.collectionRef;
          for (const key of Object.keys(filters)) {
            if (key === "price" && typeof filters[key] === "object") {
              if (filters[key].$gte !== undefined)
                fallbackQuery = fallbackQuery.where(
                  "price",
                  ">=",
                  filters[key].$gte
                );
              if (filters[key].$lte !== undefined)
                fallbackQuery = fallbackQuery.where(
                  "price",
                  "<=",
                  filters[key].$lte
                );
              continue;
            }
            if (key === "$text") continue;

            if (
              typeof filters[key] === "object" &&
              filters[key].in &&
              Array.isArray(filters[key].in)
            ) {
              fallbackQuery = fallbackQuery.where(key, "in", filters[key].in);
              continue;
            }
            fallbackQuery = fallbackQuery.where(key, "==", filters[key]);
          }
          if (options.limit) fallbackQuery = fallbackQuery.limit(options.limit);
          if (options.offset)
            fallbackQuery = fallbackQuery.offset(options.offset);

          const snapshot = await fallbackQuery.get();
          return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        }
        throw err;
      }
    } catch (error) {
      console.error(`Error in findMany for ${this.collectionName}:`, error);
      throw new Error(`Error finding documents: ${error.message}`);
    }
  }

  async update(id, data) {
    try {
      const docRef = this.collectionRef.doc(id);
      await docRef.update({
        ...data,
        updatedAt: FieldValue.serverTimestamp(),
      });
      const updatedDocSnap = await docRef.get();
      return { id: updatedDocSnap.id, ...updatedDocSnap.data() };
    } catch (error) {
      console.error(`Error in update for ${this.collectionName}:`, error);
      throw new Error(`Error updating document: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      await this.collectionRef.doc(id).delete();
      return true;
    } catch (error) {
      console.error(`Error in delete for ${this.collectionName}:`, error);
      throw new Error(`Error deleting document: ${error.message}`);
    }
  }

  async count(filters = {}) {
    try {
      let query = this.collectionRef;

      Object.keys(filters).forEach((key) => {
        if (
          typeof filters[key] === "object" &&
          filters[key].in &&
          Array.isArray(filters[key].in)
        ) {
          query = query.where(key, "in", filters[key].in);
        } else {
          query = query.where(key, "==", filters[key]);
        }
      });

      const snapshot = await query.count().get();
      return snapshot.data().count;
    } catch (error) {
      console.error(`Error in count for ${this.collectionName}:`, error);
      return 0;
    }
  }

  async exists(id) {
    try {
      const docSnap = await this.collectionRef.doc(id).get();
      return docSnap.exists;
    } catch (error) {
      console.error(`Error in exists for ${this.collectionName}:`, error);
      throw new Error(`Error checking document existence: ${error.message}`);
    }
  }
}

module.exports = BaseService;
