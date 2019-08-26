/* eslint-disable require-jsdoc */
import Util from '../helpers/util';
import result from '../helpers/bookmarks';
import TagService from '../services/data.service';
import models from '../models';

const {
  checkItem, ensureBookMark, getUserBookMarks, getUserBookMark,
  addToCollection, findCollection, renameCollection, updateItem
} = TagService;
const util = new Util();

const notFound = (msg) => {
  util.setError(404, `${msg} not found`);
  return util;
};

class BookMarkController {
  static async createBookMark(req, res) {
    const { userId } = await result(req, res);
    const article = await checkItem(req.body.articleId, 'Article');
    const name = req.body.name || `${article.title}-${new Date()}`;
    const bookmark = await ensureBookMark(req.body.articleId, name, userId);
    return res.status(201).json({
      message: `bookmark '${name}' created`, data: bookmark[0]
    });
  }

  static async editBookMark(req, res) {
    const { oldName } = req.body || req.data.name;
    const { name } = req.body || req.data.newName;
    const updated = updateItem(oldName, name, 'BookMark');
    return res.status(200).json({
      message: `bookmark ${oldName} updated to ${name}`,
      data: updated[1]
    });
  }

  static async createCollection(req, res) {
    const { userId } = await result(req, res);
    const { name, articleId, collection } = req.body;
    const added = await addToCollection(articleId, collection, name, userId);
    if (added[1]) {
      return res.status(201).json({
        message: `bookmark '${name}' added to collection '${collection}'`
      });
    }
    res.status(200).json({
      message: `bookmark '${name}' already in collection '${collection}'`
    });
  }

  static async getCollection(req, res) {
    const { userId } = await result(req, res);
    const collection = await findCollection(req.params.collection, userId, [models.Article]);
    if (collection.length) {
      return res.status(200).json({ collection });
    }
    notFound(`collection ${collection}`).send(res);
  }

  static async getCollections(req, res) {
    const { userId } = await result(req, res);
    const all = await getUserBookMarks(userId, [models.Article]);
    const collections = all.filter(x => x.collection);
    if (collections.length) {
      // reduce/map collections to collection: bookmark-count object array
      return res.status(200).json({ collections });
    }
    notFound('collections').send(res);
  }

  static async updateCollection(req, res) {
    const { userId } = await result(req, res);
    const { oldCollection, collection } = req.body;
    const updated = await renameCollection(
      collection, oldCollection, userId
    );
    if (updated) {
      return res.status(200).json({
        message: `collection '${oldCollection}' updated to ${collection}`,
        data: updated
      });
    }
    notFound('collection').send(res);
  }

  static async deleteCollection(req, res) {
    // delete collection
  }

  static async deleteFromCollection(req, res) {
    // remove bookmarks from collection
  }

  static async emptyCollection(req, res) {
    // delete all bookmarks from collection
  }

  static async getUserBookMarks(req, res) {
    const { userId } = await result(req, res);
    const bookmarks = await getUserBookMarks(userId);
    return res.status(200).json({
      message: `${bookmarks.length} bookmarks found`,
      data: bookmarks
    });
  }

  static async getUserBookMark(req, res) {
    const { userId } = await result(req, res);
    const bookmark = await getUserBookMark(userId, req.body.name, req.params.articleId);
    return res.status(200).json({
      message: `bookmark '${bookmark.name}' found`,
      data: bookmark
    });
  }

  static async deleteUserBookMark(req, res) {
    const { userId } = await result(req, res);
    const bookmark = await getUserBookMark(userId, req.body.name, req.params.articleId);
    bookmark.destroy();
    return res.status(200).json({
      message: `bookmark '${req.body.name}' deleted`
    });
  }

  static async deleteUserBookMarks(req, res) {
    const { userId } = await result(req, res);
    const reader = await checkItem(userId, 'user', ['articles']);
    const deleted = await reader.removeArticles(reader.articles);
    res.status(200).json({ message: `${deleted} bookmarks deleted` });
  }

  static async copyBookmark(req, res) {
    const {
      articleId, name, newName, userId
    } = req.data;
    const copy = await ensureBookMark(articleId, newName, userId);
    res.status(201).json({
      message: `copy of bookmark ${name} created as ${newName}`,
      data: copy
    });
  }
}

export default BookMarkController;
