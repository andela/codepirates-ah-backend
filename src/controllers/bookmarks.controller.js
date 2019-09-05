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
/**
 *
 *
 * @class BookMarks
 */
class BookMarkController {
  /**
   *
   * @description Method to create a new bookmark
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {object} server response object
   * @memberof BookMarks
   */
  static async createBookMark(req, res) {
    const article = await checkItem(req.body.articleId, 'Article');
    const name = req.body.name || `${article.title}-${new Date()}`;
    const { articleId } = req.body;
    const userId = req.auth.id;
    const bookmark = await ensureItem({ articleId, name, userId });
    const message = `bookmark '${name}' created`;
    util.setSuccess(201, message, bookmark[0]);
    return util.send(res);
  }

  /**
   *
   * @description Method to edit a bookmark
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {object} server response object
   * @memberof BookMarks
   */
  static async editBookMark(req, res) {
    const oldName = req.params.name || req.data.name;
    const name = req.body.name || req.data.newName;
    const updated = updateItem({ name }, { name: oldName });
    const message = `bookmark ${oldName} updated to ${name}`;
    util.setSuccess(200, message, updated[1]);
    return util.send(res);
  }

  /**
   *
   * @description Method to create a new collection
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {object} server response object
   * @memberof BookMarks
   */
  static async createCollection(req, res) {
    const { name, articleId, collection } = req.body;
    const userId = req.auth.id;
    const added = await ensureItem({
      articleId, collection, name, userId
    });
    if (added[1]) {
      const message = `bookmark '${name}' added to collection '${collection}'`;
      util.setSuccess(201, message, added[1]);
      return util.send(res);
    }
    const message = `bookmark '${name}' already in collection '${collection}'`;
    util.setSuccess(200, message, null);
    return util.send(res);
  }

  /**
   *
   * @description Method to get a specif collection
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {object} server response object
   * @memberof BookMarks
   */
  static async getCollection(req, res) {
    const { collection } = req.params;
    const Collection = await checkItems({ collection, userId: req.auth.id },
      'BookMark', [models.Article]);
    util.setSuccess(200, 'Collection', Collection);
    return util.send(res);
  }

  /**
   *
   * @description Method to get all collections
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {object} server response object
   * @memberof BookMarks
   */
  static async getCollections(req, res) {
    const all = await checkItems({ userId: req.auth.id }, 'BookMark', [models.Article]);
    const collections = all.filter(x => x.collection);
    if (collections.length) {
      // reduce/map collections to collection: bookmark-count object array
      util.setSuccess(200, 'collections', collections);
      return util.send(res);
    }
    notFound('collections').send(res);
  }

  /**
   *
   * @description Method to update a collection
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {object} server response object
   * @memberof BookMarks
   */
  static async updateCollection(req, res) {
    const { collection } = req.params;
    const updated = await updateItem({ collection }, {
      collection: req.body.collection,
      userId: req.auth.id
    });
    const message = `collection '${collection}' updated to ${collection}`;
    util.setSuccess(200, message, updated);
    return util.send(res);
  }

  /**
   *
   * @description Method to delete a collection
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {object} server response object
   * @memberof BookMarks
   */
  static async deleteCollection(req, res) {
    const { collection } = req.params;
    await deleteItem({ collection });
    const message = `collection '${collection}' deleted`;
    util.setSuccess(200, message, null);
    return util.send(res);
  }

  /**
   *
   * @description Method to delete a bookmark from a collection
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {object} server response object
   * @memberof BookMarks
   */
  static async unCollect(req, res) {
    const { collection, name } = req.params;
    const userId = req.auth.id;
    await updateItem({ collection: '' }, { collection, name, userId });
    const message = `bookmark ${name} deleted from collection ${collection}`;
    util.setSuccess(200, message, null);
    return util.send(res);
  }

  /**
   *
   * @description Method to get all user bookmarks
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {object} server response object
   * @memberof BookMarks
   */
  static async getUserBookMarks(req, res) {
    const bookmarks = await checkItems({ userId: req.auth.id });
    const message = `${bookmarks.length} bookmarks found`;
    util.setSuccess(200, message, bookmarks);
    return util.send(res);
  }

  /**
   *
   * @description Method to get a specific user bookmark
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {object} server response object
   * @memberof BookMarks
   */
  static async getUserBookMark(req, res) {
    const bookmark = await checkItem({ userId: req.auth.id, name: req.params.name });
    const message = `bookmark '${bookmark.name}' found`;
    util.setSuccess(200, message, bookmark);
    return util.send(res);
  }

  /**
   *
   * @description Method to delete a user bookmark
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {object} server response object
   * @memberof BookMarks
   */
  static async deleteUserBookMark(req, res) {
    const bookmark = await checkItem({ userId: req.auth.id, name: req.params.name });
    bookmark.destroy();
    const message = `bookmark '${req.params.name}' deleted`;
    util.setSuccess(200, message, null);
    return util.send(res);
  }

  /**
   *
   * @description Method to delete all user bookmarks
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {object} server response object
   * @memberof BookMarks
   */
  static async deleteUserBookMarks(req, res) {
    const reader = await checkItem(req.auth.id, 'user', ['articles']);
    const deleted = await reader.removeArticles(reader.articles);
    const message = `${deleted} bookmarks deleted`;
    util.setSuccess(200, message, null);
    return util.send(res);
  }

  /**
   *
   * @description Method to copy a bookmark
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {object} server response object
   * @memberof BookMarks
   */
  static async copyBookmark(req, res) {
    const {
      articleId, name, newName, userId
    } = req.data;
    const copy = await ensureItem({ articleId, name: newName, userId });
    const message = `copy of bookmark ${name} created as ${newName}`;
    util.setSuccess(201, message, copy);
    return util.send(res);
  }
}

export default BookMarkController;
