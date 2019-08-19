/* eslint-disable require-jsdoc */
// import isEmpty from 'utils';
import models from '../models';
import Util from '../helpers/util';
import result from '../helpers/tags';

const util = new Util();
const internalError = () => {
  util.setError(500, 'Internal Error');
  return util;
};

const notFound = (msg) => {
  util.setError(404, `${msg} not found`);
  return util;
};

const addTags = (additions) => {
  result.addArticleTags(additions);
  return result;
};

const {
  Tag, Article, ArticleTag
} = models;

class TagController {
  static async createTag(req, res) {
    // create orphan tag
    const { name } = req.body;
    Tag.findOrCreate({
      where: { name }
    }).then((tag) => {
      if (tag[1]) {
        return res.status(201).json({ message: `tag ${name} created`, data: tag[0] });
      }
      res.status(200).json({ message: `tag ${name} exists`, data: tag[0] });
    }).catch(() => {
      internalError.send(res);
    });
  }

  static async createArticleTag(req, res) {
    const tags = req.body.name.split(', ');
    const article = await Article.findOne({
      where: { id: req.params.articleId },
    });
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
    // changes the name of a given tag if new name still unique or merges tags
    // with all its relationships if new name exists.
    // must confirm merger from user
    const { name } = req.params;
    const newName = req.body.name;
    Tag.update({ name: newName }, {
      where: { name },
      returning: true,
    }).then(updated => res.status(200).json({
      message: `tag ${name} updated to ${newName}`, data: updated[1]
    })).catch(() => internalError().send(res));
  }

  static async editArticleTag(req, res) {
    const newTag = await Tag.findOrCreate({
      where: { name: req.body.name }
    });
    const oldTag = await Tag.findOne({
      where: { name: req.params.name }
    });// case where oldtag non existent
    ArticleTag.update(
      { tagId: newTag[0].id, articleId: req.params.articleId },
      {
        where: {
          tagId: oldTag.id, articleId: req.params.articleId
        },
        returning: true,
        raw: true
      }
    ).then((updated) => {
      if (updated[0] !== 0) {
        res.status(200).json({ message: 'update successful', data: updated[1][0] });
      }
      notFound(oldTag.name).send(res);
    })
      .catch(() => internalError());
  }

  static async getTags(req, res) {
    // gets and returns an array of objects having tags and the number of
    // articles for each tags
    Tag.findAll({ include: ['articles'] })
      .then((tags) => {
        if (tags.length === 0) {
          notFound('tags').send(res);// not tested
        }
        // reduce tags list to give article numbers only
        res.status(200).json({ tags });
      }).catch(() => internalError().send(res));
  }

  static getTag(req, res) {
    // gets and returns a given tag and the number of articles with this tag
    Tag.findOne({
      where: { name: req.params.name },
      include: ['articles']
    }).then((tag) => {
      if (tag) {
        return res.status(200).json({
          tag: {
            id: tag.id, name: tag.name, articleCount: tag.articles.length
          }
        });
      }
      notFound('tag').send(res);
    }).catch(() => internalError().send(res));
  }

  static async getTagArticles(req, res) {
    // gets an array of all articles with the given tag
    Tag.findAll({
      // alternatively use tag.getArticles()
      where: { name: req.params.name },
      include: ['articles'],
    }).then((articles) => {
      if (articles[0].articles.length === 0) {
        return notFound(`articles about ${req.params.name}`).send(res);
      }
      res.status(200).json({
        articles: articles.map(element => element.articles)
      });
    }).catch(() => internalError().send(res));
  }

  static async getArticleTags(req, res) {
    // returns an array of all tags for a given article
    Article.findOne({
      where: { id: req.params.articleId },
      include: ['tags']
    }).then((article) => {
      if (article.tags.length === 0) {
        return res.status(200).json({ message: 'article not tagged' });
      }
      res.status(200).json({ tags: article.tags.map(tag => tag.name) });
    }).catch(() => internalError().send(res));
  }

  static async deleteArticleTag(req, res) {
    // deletes a given tag of a given article technically the tag and article
    // remain undeleted, only the association in the ArticleTags table is
    // deleted
    ArticleTag.destroy({
      // alternatively, use article.removeTag(tag)
      where: { articleId: req.params.articleId, tagId: req.params.tagId }
    }).then((deleted) => {
      if (deleted) {
        return res.status(200).json({
          message: `tag with Id ${req.params.tagId} removed from article`
        });
      }
      res.status(404).json({
        message: `this article has no tag ${req.params.tagId}`
      });
    }).catch(() => internalError().send(res));
  }

  static async deleteTagArticles(req, res) {
    // deletes all articles about a particular item/tag
    Tag.findOne({
      where: { name: req.params.name },
      include: ['articles']
    }).then((tag) => {
      if (tag.articles.length === 0) {
        return res.status(404).json({
          message: `no articles about ${req.params.name}`
        });
      }
      res.status(200).json({
        message: `all articles about ${req.params.name} deleted`
      });
    }).catch(() => internalError().send(res));
  }
}

export default TagController;
