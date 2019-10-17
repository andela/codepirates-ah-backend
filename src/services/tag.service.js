/* eslint-disable require-jsdoc */
import { Sequelize } from 'sequelize';
import models from '../models';

const { Tag, Article, ArticleTag } = models;

const Models = { Article, Tag };
const { Op } = Sequelize;


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

  static async searchTag(model, tag, offset, limit, include = null) {
    try {
      const results = await Models[model].findAll({
        where: {
          [Op.or]: [{ name: { [Op.iLike]: `%${tag}%` } }]
        },
        offset,
        limit,
        include,
      });
      return results;
    } catch (error) {
      throw error;
    }
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
    return Models[model].update(
      { name: newName },
      {
        where: { name },
        returning: true
      }
    );
  }

  static async updateArticleTag(tagId, newName, articleId) {
    return ArticleTag.update(
      { tagId: newName, articleId },
      {
        where: { tagId, articleId },
        returning: true
      }
    );
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
}


export default TagService;
