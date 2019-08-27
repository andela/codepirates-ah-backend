/* eslint-disable require-jsdoc */
import models from '../models';

const {
  Article, BookMark, user
} = models;

const Models = {
  Article, user, BookMark
};


class dbService {
  static async checkItem(id, model, include = null) {
    return Models[model].findOne({
      where: { id },
      include
    });
  }

  static async checkName(name, model, include = null) {
    return Models[model].findOne({
      where: { name },
      include
    });
  }

  static async updateItem(name, newName, model) {
    return Models[model].update({ name: newName },
      { where: { name }, returning: true });
  }

  static async ensureBookMark(articleId, name, userId) {
    return BookMark.findOrCreate({
      where: { articleId, name, userId }
    });
  }

  static async deleteBookMark(articleId, name, userId) {
    return BookMark.destroy({
      where: { articleId, name, userId }
    });
  }

  static async getUserBookMarks(userId, include = null) {
    return BookMark.findAll({
      where: { userId },
      include
    });
  }

  static async getUserBookMark(userId, name, articleId) {
    return BookMark.findOne({
      where: { userId, name, articleId },
      include: [models.Article]
    });
  }

  static async getBookMarkName(userId, name) {
    return BookMark.findOne({
      where: { userId, name },
      include: [models.Article]
    });
  }

  static async checkExisting(userId, articleId) {
    return BookMark.findOne({
      where: { userId, articleId }
    });
  }

  static async addToCollection(articleId, collection, name, userId) {
    return BookMark.findOrCreate({
      where: {
        articleId, collection, name, userId
      }
    });
  }

  static async renameCollection(collection, old, userId) {
    return BookMark.update({ collection },
      { where: { collection: old, userId } });
  }

  static async checkCollection(collection, userId) {
    return BookMark.findOne({
      where: { collection, userId }
    });
  }

  static async findCollection(collection, userId, include = null) {
    return BookMark.findAll({
      where: { collection, userId },
      include
    });
  }

  static async deleteCollection(collection) {
    return BookMark.destroy({ where: { collection } });
  }

  static async unCollect(collection, name, userId) {
    return BookMark.update({ collection: '' },
      {
        where: { collection, name, userId }
      });
  }
}

export default dbService;
