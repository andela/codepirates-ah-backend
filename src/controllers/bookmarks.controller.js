/* eslint-disable require-jsdoc */
import Util from '../helpers/util';
import dbService from '../services/data.service';
import models from '../models';

const {
  checkItem, ensureBookMark, getUserBookMarks, addToCollection,
  findCollection, renameCollection, updateItem, deleteCollection,
  unCollect, getBookMarkName
} = dbService;

const util = new Util();

const notFound = (msg) => {
  util.setError(404, `${msg} not found`);
  return util;
};

class BookMarkController {
  static async createBookMark(req, res) {
    const article = await checkItem(req.body.articleId, 'Article');
    const name = req.body.name || `${article.title}-${new Date()}`;
    const bookmark = await ensureBookMark(req.body.articleId, name, req.auth.id);
    return res.status(201).json({
      message: `bookmark '${name}' created`, data: bookmark[0]
    });
  }

  static async editBookMark(req, res) {
    const oldName = req.params.name || req.data.name;
    const name = req.body.name || req.data.newName;
    const updated = updateItem(oldName, name, 'BookMark');
    return res.status(200).json({
      message: `bookmark ${oldName} updated to ${name}`,
      data: updated[1]
    });
  }

  static async createCollection(req, res) {
    const { name, articleId, collection } = req.body;
    const added = await addToCollection(articleId, collection, name, req.auth.id);
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
    const collection = await findCollection(req.params.collection, req.auth.id, [models.Article]);
    return res.status(200).json({ collection });
  }

  static async getCollections(req, res) {
    const all = await getUserBookMarks(req.auth.id, [models.Article]);
    const collections = all.filter(x => x.collection);
    if (collections.length) {
      // reduce/map collections to collection: bookmark-count object array
      return res.status(200).json({ collections });
    }
    notFound('collections').send(res);
  }

  static async updateCollection(req, res) {
    const { collection } = req.params;
    const updated = await renameCollection(
      req.body.collection, collection, req.auth.id
    );
    return res.status(200).json({
      message: `collection '${collection}' updated to ${collection}`,
      data: updated
    });
  }

  // delete collection and content
  static async deleteCollection(req, res) {
    const { collection } = req.params;
    await deleteCollection(collection);
    return res.status(200).json({ message: `collection '${collection}' deleted` });
  }

  // delete from collection
  static async unCollect(req, res) {
    const { collection, name } = req.params;
    await unCollect(collection, name, req.auth.id);
    return res.status(200).json({
      message: `bookmark ${name} deleted from collection ${collection}`
    });
  }

  static async getUserBookMarks(req, res) {
    const bookmarks = await getUserBookMarks(req.auth.id);
    return res.status(200).json({
      message: `${bookmarks.length} bookmarks found`,
      data: bookmarks
    });
  }

  static async getUserBookMark(req, res) {
    const bookmark = await getBookMarkName(req.auth.id, req.params.name);
    return res.status(200).json({
      message: `bookmark '${bookmark.name}' found`,
      data: bookmark
    });
  }

  static async deleteUserBookMark(req, res) {
    const bookmark = await getBookMarkName(req.auth.id, req.params.name);
    bookmark.destroy();
    return res.status(200).json({
      message: `bookmark '${req.params.name}' deleted`
    });
  }

  static async deleteUserBookMarks(req, res) {
    const reader = await checkItem(req.auth.id, 'user', ['articles']);
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
