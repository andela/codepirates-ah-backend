import models from '../models';
import Util from '../helpers/util';
import service from '../services/tag.service';
import result from '../helpers/tags';

const util = new Util();

const notFound = (msg) => {
  util.setError(404, `${msg} not found`);
  return util;
};

const addTags = (additions) => {
  result.addArticleTags(additions);
  return result;
};

const {
  Tag
} = models;

const {
  checkItem, checkName, ensureItem, updateItem, updateArticleTag, getCollection, getAll
} = service;

/**
 *
 *
 * @class Tags
 */
class TagController {
  /**
   * @description Method for creating general tags
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {object} server response object
   * @memberof TagController
   */
  static async createTag(req, res) {
    const { name } = req.body;
    const tag = await ensureItem(name, 'Tag');
    if (tag[1]) {
      util.setSuccess(201, `tag '${name}' created`, tag[0]);
      return util.send(res);
    }
    util.setSuccess(200, `tag '${name}' exists`, tag[0]);
    return util.send(res);
  }

  /**
   * @description Method for creating a specific tag for the article
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {object} server response object
   * @memberof TagController
   */
  static async createArticleTag(req, res) {
    const tags = req.body.name.split(', ');
    const article = await checkItem(req.params.articleId, 'Article');
    const currentTags = await article.getTags();
    const added = tags.filter(elt => !currentTags.map(x => x.name).includes(elt));
    const exists = tags.filter(elt => currentTags.map(x => x.name).includes(elt));
    tags.forEach((name) => {
      Tag.findOrCreate({
        where: { name }
      }).then(tag => article.addTag(tag[0]));
    });
    return addTags([added, exists, article]).send(res);
  }

  /**
   * @description Method for editing a general tag
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {object} server response object
   * @memberof TagController
   */
  static async editTag(req, res) {
    const { name } = req.params;
    const newName = req.body.name;
    const updated = await updateItem(name, newName, 'Tag');
    util.setSuccess(200, `tag '${name}' updated to '${newName}'`, updated[1]);
    return util.send(res);
  }

  /**
   * @description Method for editing a specific tag for the article
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {object} server response object
   * @memberof TagController
   */
  static async editArticleTag(req, res) {
    const newTag = await ensureItem(req.body.name, 'Tag');
    const oldTag = await checkName(req.params.name, 'Tag');
    if (req.params.name === req.body.name) {
      util.setSuccess(200, 'no update, new and old names the same', null);
      return util.send(res);
    }
    const updated = await updateArticleTag(oldTag.id, newTag[0].id, req.params.articleId);
    if (updated[0]) {
      util.setSuccess(200, 'update successful', updated[1][0]);
      return util.send(res);
    }
    util.setSuccess(200, `article has no tag '${oldTag.name}'`, null);
    return util.send(res);
  }

  /**
   * @description Method for getting all tags
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {object} server response object
   * @memberof TagController
   */
  static async getTags(req, res) {
    const tags = await getAll('Tag', ['articles']);
    util.setSuccess(200, 'list of tags', tags);
    return util.send(res);
  }

  /**
   * @description Method for getting a specific tag
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {object} server response object
   * @memberof TagController
   */
  static async getTag(req, res) {
    const tag = await checkName(req.params.name, 'Tag', ['articles']);
    util.setSuccess(200, 'Tag retrieved successfully', { id: tag.id, name: tag.name, articleCount: tag.articles.length });
    return util.send(res);
  }

  /**
   * @description Method for getting all tags associated with an article
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {object} server response object
   * @memberof TagController
   */
  static async getTagArticles(req, res) {
    const articles = await getCollection('Tag', req.params.name, ['articles']);
    if (articles[0].articles.length === 0) {
      return notFound(`articles about '${req.params.name}'`).send(res);
    }
    res.status(200).json({
      articles: articles.map(element => element.articles)
    });
  }

  /**
   * @description Method for getting tags for the article
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {object} server response object
   * @memberof TagController
   */
  static async getArticleTags(req, res) {
    const article = await checkItem(req.params.articleId, 'Article', ['tags']);
    if (article.tags.length === 0) {
      util.setSuccess(200, 'article not tagged', { articleId: req.params.articleId });
      return util.send(res);
    }
    util.setSuccess(200, 'tags', { tags: article.tags.map(tag => tag.name) });
    return util.send(res);
  }

  /**
   * @description Method for deleting a specific tag for the article
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {object} server response object
   * @memberof TagController
   */
  static async deleteArticleTag(req, res) {
    const article = await checkItem(req.params.articleId, 'Article', ['tags']);
    const tag = await checkName(req.params.name, 'Tag');
    const removed = await article.removeTag(tag);
    if (!removed) {
      return notFound(`tag '${req.params.name}'`).send(res);
    }
    util.setSuccess(200, `tag ${req.params.name} removed from article`, { articleId: req.params.articleId });
    return util.send(res);
  }

  /**
   * @description Method for creating all tags for the article
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {object} server response object
   * @memberof TagController
   */
  static async deleteTagArticles(req, res) {
    const tag = await checkName(req.params.name, 'Tag', ['articles']);
    if (tag.articles.length === 0) {
      return notFound(`articles about '${req.params.name}'`).send(res);
    }
    tag.removeArticles(tag.articles);
    res.status(200).json({
      message: `all articles about '${req.params.name}' deleted`
    });
    util.setSuccess(200, `all articles about '${req.params.name}' deleted`, { tagName: req.params.name });
    return util.send(res);
  }
}

export default TagController;
