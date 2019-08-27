/* eslint-disable require-jsdoc */
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

class TagController {
  static async createTag(req, res) {
    const { name } = req.body;
    const tag = await ensureItem(name, 'Tag');
    if (tag[1]) {
      return res.status(201).json({ message: `tag '${name}' created`, data: tag[0] });
    }
    res.status(200).json({ message: `tag '${name}' exists`, data: tag[0] });
  }

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

  static async editTag(req, res) {
    const { name } = req.params;
    const newName = req.body.name;
    const updated = await updateItem(name, newName, 'Tag');
    return res.status(200).json({
      message: `tag '${name}' updated to '${newName}'`, data: updated[1]
    });
  }

  static async editArticleTag(req, res) {
    const newTag = await ensureItem(req.body.name, 'Tag');
    const oldTag = await checkName(req.params.name, 'Tag');
    if (req.params.name === req.body.name) {
      return res.status(200).json({ message: 'no update, new and old names the same' });
    }
    const updated = await updateArticleTag(oldTag.id, newTag[0].id, req.params.articleId);
    if (updated[0]) {
      return res.status(200).json({
        message: 'update successful', data: updated[1][0]
      });
    }
    res.status(400).json({ message: `article has no tag '${oldTag.name}'` });
  }

  static async getTags(req, res) {
    const tags = await getAll('Tag', ['articles']);
    res.status(200).json({ tags });
  }

  static async getTag(req, res) {
    const tag = await checkName(req.params.name, 'Tag', ['articles']);
    res.status(200).json({
      tag: {
        id: tag.id, name: tag.name, articleCount: tag.articles.length
      }
    });
  }

  static async getTagArticles(req, res) {
    const articles = await getCollection('Tag', req.params.name, ['articles']);
    if (articles[0].articles.length === 0) {
      return notFound(`articles about '${req.params.name}'`).send(res);
    }
    res.status(200).json({
      articles: articles.map(element => element.articles)
    });
  }

  static async getArticleTags(req, res) {
    const article = await checkItem(req.params.articleId, 'Article', ['tags']);
    if (article.tags.length === 0) {
      return res.status(200).json({ message: 'article not tagged' });
    }
    res.status(200).json({ tags: article.tags.map(tag => tag.name) });
  }

  static async deleteArticleTag(req, res) {
    const article = await checkItem(req.params.articleId, 'Article', ['tags']);
    const tag = await checkName(req.params.name, 'Tag');
    const removed = await article.removeTag(tag);
    if (!removed) {
      return notFound(`tag '${req.params.name}'`).send(res);
    }
    res.status(200).json({
      message: `tag ${req.params.name} removed from article`
    });
  }

  static async deleteTagArticles(req, res) {
    const tag = await checkName(req.params.name, 'Tag', ['articles']);
    if (tag.articles.length === 0) {
      return notFound(`articles about '${req.params.name}'`).send(res);
    }
    tag.removeArticles(tag.articles);
    res.status(200).json({
      message: `all articles about '${req.params.name}' deleted`
    });
  }
}

export default TagController;
