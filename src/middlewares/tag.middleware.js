/* eslint-disable require-jsdoc */
// import isEmpty from 'utils';
import models from '../models';
import Util from '../helpers/util';

const util = new Util();
const internalError = () => {
  util.setError(500, 'Internal Error');
  return util;
};

const notFound = (msg) => {
  util.setError(404, `${msg} not found`);
  return util;
};

const { Tag, Article } = models;

let found;

class TagService {
  static async checkArticle(req, res, next) {
    if (!/^\d+$/.test(req.params.articleId)) {
      res.status(400).json({ error: 'articleId must be an integer' });
    }
    // validateReq(req, res, next);
    Article.findOne({
      where: { id: req.params.articleId },
    }).then((article) => {
      if (!article) {
        return notFound('article').send(res);
      }
      found = article;
      next();
    }).catch(() => internalError().send(res));
  }

  static async checkTagName(req, res, next) {
    Tag.findOne({
      where: { name: req.params.name },
    }).then((article) => {
      if (!article) {
        return notFound(`tag ${req.params.name}`).send(res);
      }
      next();
    }).catch(() => internalError().send(res));
  }

  static async checkTagId(req, res, next) {
    Tag.findOne({
      where: { id: req.params.tagId },
    }).then((tag) => {
      if (!tag) {
        return notFound('tag').send(res);
      }
      next();
    }).catch(() => internalError().send(res));
  }

  static async tagLimit(req, res, next) {
    found.getTags()
      .then((tags) => {
        if (tags.length >= 5) {
          return res.status(200).json({
            message: 'this article already has the maximum number of tags, delete or update one',
            data: found
          });
        }
        if ((tags.length + req.body.name.split(', ').length) > 5) {
          return res.status(200).json({
            message:
              `article already has ${tags.length} tags, you ca only add ${5 - tags.length} more`,
            data: found
          });
        }
        next();
      }).catch(() => internalError());
  }

  static tagLength(req, res, next) {
    const longTag = req.body.name.split(', ').some(tag => tag.split(' ').length > 3);
    if (longTag) {
      return res.status(400).json({ error: 'tag name must be maximum three words' });
    }
    next();
  }
}


export default TagService;
