/* eslint-disable require-jsdoc */
// import isEmpty from 'utils';
import TagService from '../services/tag.service';
import Util from '../helpers/util';

const util = new Util();

const notFound = (msg) => {
  util.setError(404, `${msg} not found`);
  return util;
};

const {
  checkItem, checkTagName, checkArticleTags
} = TagService;

let found;
class TagWare {
  static async checkArticle(req, res, next) {
    if (!/^\d+$/.test(req.params.articleId)) {
      return res.status(400).json({ error: 'articleId must be an integer' });
    }
    const article = await checkItem(req.params.articleId, 'Article');
    if (!article) {
      return notFound('article').send(res);
    }
    found = article;
    next();
  }

  static async checkTagName(req, res, next) {
    const accepted = /^[\w\s]+$/;
    if (!accepted.test(req.params.name) || !accepted.test(req.body.name)) {
      return res.status(400).json({ error: 'tag name must be descriptive' });
    }
    const tag = await checkTagName(req.params.name);
    if (!tag) {
      return notFound(`tag ${req.params.name}`).send(res);
    }
    next();
  }

  static async tagLimit(req, res, next) {
    const tags = await checkArticleTags(found);
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
  }

  static tagLength(req, res, next) {
    const longTag = req.body.name.split(', ').some(tag => tag.split(' ').length > 3);
    if (longTag) {
      return res.status(400).json({ error: 'tag name must be maximum three words' });
    }
    next();
  }
}


export default TagWare;
