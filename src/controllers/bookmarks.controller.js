/* eslint-disable require-jsdoc */
import Util from '../helpers/util';
import dbService from '../services/data.service';
import models from '../models';

const {
  checkItem, ensureItem, checkItems, deleteItem, updateItem
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
    const { articleId } = req.body;
    const userId = req.auth.id;
    const bookmark = await ensureItem({ articleId, name, userId });
    return res.status(201).json({
      message: `bookmark '${name}' created`, data: bookmark[0]
    });
  }

  static async editBookMark(req, res) {
    const oldName = req.params.name || req.data.name;
    const name = req.body.name || req.data.newName;
    const updated = updateItem({ name }, { name: oldName });
    return res.status(200).json({
      message: `bookmark ${oldName} updated to ${name}`,
      data: updated[1]
    });
  }

  static async createCollection(req, res) {
    const { name, articleId, collection } = req.body;
    const userId = req.auth.id;
    const added = await ensureItem({
      articleId, collection, name, userId
    });
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
    const { collection } = req.params;
    const Collection = await checkItems({ collection, userId: req.auth.id },
      'BookMark', [models.Article]);
    return res.status(200).json({ Collection });
  }

  static async getCollections(req, res) {
    const all = await checkItems({ userId: req.auth.id }, 'BookMark', [models.Article]);
    const collections = all.filter(x => x.collection);
    if (collections.length) {
      // reduce/map collections to collection: bookmark-count object array
      return res.status(200).json({ collections });
    }
    notFound('collections').send(res);
  }

  static async updateCollection(req, res) {
    const { collection } = req.params;
    const updated = await updateItem({ collection }, {
      collection: req.body.collection,
      userId: req.auth.id
    });
    return res.status(200).json({
      message: `collection '${collection}' updated to ${collection}`,
      data: updated
    });
  }

  // delete collection and content
  static async deleteCollection(req, res) {
    const { collection } = req.params;
    await deleteItem({ collection });
    return res.status(404).json({ message: `collection '${collection}' deleted` });
  }

  // delete from collection
  static async unCollect(req, res) {
    const { collection, name } = req.params;
    const userId = req.auth.id;
    await updateItem({ collection: '' }, { collection, name, userId });
    return res.status(404).json({
      message: `bookmark ${name} deleted from collection ${collection}`
    });
  }

  static async getUserBookMarks(req, res) {
    const bookmarks = await checkItems({ userId: req.auth.id });
    return res.status(200).json({
      message: `${bookmarks.length} bookmarks found`,
      data: bookmarks
    });
  }

  static async getUserBookMark(req, res) {
    const bookmark = await checkItem({ userId: req.auth.id, name: req.params.name });
    return res.status(200).json({
      message: `bookmark '${bookmark.name}' found`,
      data: bookmark
    });
  }

  static async deleteUserBookMark(req, res) {
    const bookmark = await checkItem({ userId: req.auth.id, name: req.params.name });
    bookmark.destroy();
    return res.status(404).json({
      message: `bookmark '${req.params.name}' deleted`
    });
  }

  static async deleteUserBookMarks(req, res) {
    const reader = await checkItem(req.auth.id, 'user', ['articles']);
    const deleted = await reader.removeArticles(reader.articles);
    res.status(404).json({ message: `${deleted} bookmarks deleted` });
  }

  static async copyBookmark(req, res) {
    const {
      articleId, name, newName, userId
    } = req.data;
    const copy = await ensureItem({ articleId, name: newName, userId });
    res.status(201).json({
      message: `copy of bookmark ${name} created as ${newName}`,
      data: copy
    });
  }
}

export default BookMarkController;
