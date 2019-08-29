/* eslint-disable require-jsdoc */
import Util from '../helpers/util';
import dbService from '../services/data.service';

const { checkItems, checkItem } = dbService;

const util = new Util();

const notFound = (msg) => {
  util.setError(404, `${msg} not found`);
  return util;
};

let data;
class BookMarkWare {
  static async checkBookmark(req, res, next) {
    const userId = req.auth.id;
    const articleId = req.params.articleId || req.body.articleId;
    const name = req.body.oldName ? req.body.oldName : req.params.name || req.body.name;
    const bookmark = await checkItem({ userId, name, articleId });

    if (!bookmark) {
      return notFound(`bookmark ${name} with article ID ${articleId}`).send(res);
    }
    if (req.method === 'PATCH' && req.body.name === req.params.name) {
      return res.status(400).json({ message: 'update aborted, old and new name the same' });
    }
    next();
  }

  static async checkUserBookMarks(req, res, next) {
    const bookmarks = await checkItems({ userId: req.auth.id });
    if (!bookmarks.length) {
      return notFound('user bookmarks').send(res);
    }
    next();
  }

  static async checkCollection(req, res, next) {
    const oldCollection = req.body.oldCollection || req.params.collection;
    const found = await checkItem(
      { collection: oldCollection, userId: req.auth.id }
    );
    if (!found) {
      return notFound(`collection '${oldCollection}'`).send(res);
    }
    next();
  }

  static async checkDuplicate(req, res, next) {
    const { articleId, name } = req.body;
    const existing = await checkItem({ userId: req.auth.id, articleId });
    const existingName = await checkItem({ name });
    const bookmark = await checkItem({ userId: req.auth.id, name, articleId });
    const article = await checkItem({ id: articleId }, 'Article', []);
    if (!article) {
      return notFound(`article with id ${articleId}`).send(res);
    }
    if (bookmark) {
      return res.status(200).json({
        message: `bookmark '${name}' exists`, data: bookmark
      });
    }
    if (existing && existing.name) {
      data = existing;
      data.newName = name;
      return res.status(409).json({
        message: `bookmark existing as '${existing.name}'`,
        options: {
          1: `create copy with new name ${name} on /api/v1/users/copy`,
          2: `update the name to ${name} on /api/v1/users/update`
        },
        data: existing
      });
    }
    if (existingName) {
      res.status(409).json({
        message: `another bookmark with name ${name}`,
        data: existingName
      });
    }
    next();
  }

  static async createCopy(req, res, next) {
    req.data = data;
    next();
  }

  static async checkBookmarkName(req, res, next) {
    const { name } = req.params;
    const bookmark = await checkItem({ userId: req.auth.id, name });
    if (!bookmark) {
      return notFound(`bookmark '${name}'`).send(res);
    }
    if (req.body.name === name) {
      return res.status(400).json({ message: 'update aborted, old and new name the same' });
    }
    next();
  }
}

export default BookMarkWare;
