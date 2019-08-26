/* eslint-disable require-jsdoc */
import Util from '../helpers/util';
import result from '../helpers/bookmarks';
import TagService from '../services/data.service';

const {
  getUserBookMarks, getUserBookMark, checkExisting, checkName
} = TagService;
const util = new Util();

const notFound = (msg) => {
  util.setError(404, `${msg} not found`);
  return util;
};

let data;
class BookMarkWare {
  static async checkBookmark(req, res, next) {
    const { userId } = await result(req, res);
    const articleId = req.params.articleId || req.body.articleId;
    const name = req.body.oldName ? req.body.oldName : req.body.name;
    const bookmark = await getUserBookMark(userId, name, articleId);
    if (!bookmark) {
      return notFound(`bookmark ${name} with article ID ${articleId}`).send(res);
    }
    if (req.method === 'PATCH' && req.body.oldName === req.body.name) {
      return res.status(400).json({ message: 'update aborted, old and new name the same' });
    }
    next();
  }

  static async checkUserBookMarks(req, res, next) {
    const { userId } = await result(req, res);
    const bookmarks = await getUserBookMarks(userId);
    if (!bookmarks.length) {
      return notFound('user bookmarks').send(res);
    }
    next();
  }

  static async checkDuplicate(req, res, next) {
    const { userId } = await result(req, res);
    const { articleId, name } = req.body;
    const existing = await checkExisting(userId, articleId);
    const existingName = await checkName(name, 'BookMark');
    const bookmark = await getUserBookMark(userId, name, articleId);
    if (bookmark) {
      return res.status(200).json({
        message: `bookmark '${name}' exists`, data: bookmark
      });
    }
    if (existing && existing.name) {
      data = existing;
      data.newName = name;
      return res.status(200).json({
        message: `bookmark existing as '${existing.name}'`,
        options: {
          1: `create copy with new name ${name} on /api/v1/users/copy`,
          2: `update the name to ${name} on /api/v1/users/update`
        },
        data: existing
      });
    }
    if (existingName) {
      res.status(200).json({
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
}

export default BookMarkWare;
