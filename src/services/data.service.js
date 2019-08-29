/* eslint-disable require-jsdoc */
import models from '../models';

const { Article, BookMark, user } = models;

const Models = { Article, user, BookMark };
const condition = (where, include) => ({ where, include });
const change = (New, where) => ([New, { where }]);

class dbService {
  static async checkItems(where, model = 'BookMark', include = null) {
    return Models[model].findAll(condition(where, include));
  }

  static async checkItem(where, model = 'BookMark', include = null) {
    return Models[model].findOne(condition(where, include));
  }


  static async updateItem(New, where, model = 'BookMark') {
    return Models[model].update(change(New, where)[0],
      change(New, where)[1]);
  }

  static async ensureItem(where, model = 'BookMark', include = null) {
    return Models[model].findOrCreate(condition(where, include));
  }

  static async deleteItem(where, model = 'BookMark', include = null) {
    return Models[model].destroy(condition(where, include));
  }
}

export default dbService;
