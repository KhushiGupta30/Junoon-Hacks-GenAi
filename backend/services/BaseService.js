const db = require('../firebase');

class BaseService {
  constructor(collectionName) {
    this.collection = db.collection(collectionName);
  }

  async create(data) {
    try {
      const docRef = await this.collection.add({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return { id: docRef.id, ...data };
    } catch (error) {
      throw new Error(`Error creating document: ${error.message}`);
    }
  }

  async findById(id) {
    try {
      const doc = await this.collection.doc(id).get();
      if (!doc.exists) {
        return null;
      }
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      throw new Error(`Error finding document: ${error.message}`);
    }
  }

  async findOne(filters) {
    try {
      let query = this.collection;
      
      Object.keys(filters).forEach(key => {
        query = query.where(key, '==', filters[key]);
      });
      
      const snapshot = await query.limit(1).get();
      if (snapshot.empty) {
        return null;
      }
      
      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      throw new Error(`Error finding document: ${error.message}`);
    }
  }

  async findMany(filters = {}, options = {}) {
    try {
      let query = this.collection;
      
      // Apply filters
      for (const key of Object.keys(filters)) {
        if (key === 'price' && typeof filters[key] === 'object') {
          if (filters[key].$gte !== undefined) {
            query = query.where('price', '>=', filters[key].$gte);
          }
          if (filters[key].$lte !== undefined) {
            query = query.where('price', '<=', filters[key].$lte);
          }
          continue;
        }
        if (key === '$text') {
          // Skip unsupported text search filter in Firestore
          continue;
        }
        query = query.where(key, '==', filters[key]);
      }

      // Apply sorting
      if (options.sortBy) {
        const direction = options.sortOrder === 'asc' ? 'asc' : 'desc';
        query = query.orderBy(options.sortBy, direction);
      }

      // Apply pagination
      if (options.limit) {
        query = query.limit(options.limit);
      }
      if (options.offset) {
        query = query.offset(options.offset);
      }

      try {
        const snapshot = await query.get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (err) {
        // Firestore composite index missing: retry without orderBy
        const needsIndex = typeof err?.message === 'string' && err.message.toLowerCase().includes('index');
        if (needsIndex && options.sortBy) {
          let fallbackQuery = this.collection;
          for (const key of Object.keys(filters)) {
            if (key === 'price' && typeof filters[key] === 'object') {
              if (filters[key].$gte !== undefined) fallbackQuery = fallbackQuery.where('price', '>=', filters[key].$gte);
              if (filters[key].$lte !== undefined) fallbackQuery = fallbackQuery.where('price', '<=', filters[key].$lte);
              continue;
            }
            if (key === '$text') continue;
            fallbackQuery = fallbackQuery.where(key, '==', filters[key]);
          }
          if (options.limit) fallbackQuery = fallbackQuery.limit(options.limit);
          if (options.offset) fallbackQuery = fallbackQuery.offset(options.offset);
          const snapshot = await fallbackQuery.get();
          return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        }
        throw err;
      }
    } catch (error) {
      throw new Error(`Error finding documents: ${error.message}`);
    }
  }

  async update(id, data) {
    try {
      await this.collection.doc(id).update({
        ...data,
        updatedAt: new Date()
      });
      return await this.findById(id);
    } catch (error) {
      throw new Error(`Error updating document: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      await this.collection.doc(id).delete();
      return true;
    } catch (error) {
      throw new Error(`Error deleting document: ${error.message}`);
    }
  }

  async count(filters = {}) {
    try {
      let query = this.collection;
      
      Object.keys(filters).forEach(key => {
        query = query.where(key, '==', filters[key]);
      });
      
      const snapshot = await query.get();
      return snapshot.size;
    } catch (error) {
      throw new Error(`Error counting documents: ${error.message}`);
    }
  }

  async exists(id) {
    try {
      const doc = await this.collection.doc(id).get();
      return doc.exists;
    } catch (error) {
      throw new Error(`Error checking document existence: ${error.message}`);
    }
  }
}

module.exports = BaseService;
