/* eslint-disable require-jsdoc */
import models from '../models';

const {
  Tag, Article, ArticleTag, BookMark, user
} = models;

const Models = {
  Article, Tag, user, BookMark
};


class TagService {
  static async getCollection(model, name, include = null) {
    return Models[model].findAll({
      where: { name },
      include
    });
  }

  static async getAll(model, include = null) {
    return Models[model].findAll({
      include
    });
  }

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

  static async ensureItem(name, model) {
    return Models[model].findOrCreate({
      where: { name }
    });
  }

  static async updateItem(name, newName, model) {
    return Models[model].update({ name: newName },
      { where: { name }, returning: true });
  }

  static async updateArticleTag(tagId, newName, articleId) {
    return ArticleTag.update({ tagId: newName, articleId },
      { where: { tagId, articleId }, returning: true });
  }

  static async checkArticleTags(article) {
    return article.getTags();
  }

  static async checkTagName(name) {
    return Tag.findOne({
      where: { name }
    });
  }

  static async tagLimit() {
    return this.checkArticle.getTags();
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

  static async findCollection(collection, userId, include = null) {
    return BookMark.findAll({
      where: { collection, userId },
      include
    });
  }
}

export default TagService;
