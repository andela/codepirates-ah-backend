import 'dotenv/config';
import slug from 'slug';
import _ from 'lodash';
import uniqid from 'uniqid';
import models from '../models';
import Userservice from '../services/user.service';
import articleService from '../services/article.service';
import Helper from '../helpers/helper';
import NotificationServices from '../services/notification.service';
import cloudinaryHelper from '../helpers/cloudinaryHelper';
import OpenUrlHelper from '../helpers/share.article.helper';
import Util from '../helpers/util';
import statsService from '../services/db.service';

const { notifyViaEmailAndPush } = NotificationServices;
const util = new Util();

const db = models.Article;
/**
 *
 *
 * @class Articles
 */
class Articles {
  /**
   *
   * @description Method to create a new Article
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {object} server response object
   * @memberof Articles
   */
  static async createArticles(req, res) {
    const userId = req.auth.id;
    const findUser = await Userservice.getOneUser(userId);
    const images = await cloudinaryHelper.generateCloudinaryUrl(req.files);

    if (findUser) {
      const { title } = req.body;
      const article = {
        slug: `${slug(title)}-${uniqid()}`,
        title,
        description: req.body.description,
        body: req.body.body,
        authorId: req.auth.id,
        images
      };
      const createdArticle = await articleService.addArticle(article);
      await notifyViaEmailAndPush(req, res, createdArticle.slug);
      const response = {
        slug: createdArticle.slug,
        title: createdArticle.title,
        description: createdArticle.description,
        body: createdArticle.body,
        flagged: createdArticle.flagged,
        favorited: createdArticle.favorited,
        favoritedcount: createdArticle.favoritedcount,
        images: createdArticle.images,
        createdAt: createdArticle.createdAt,
        updatedAt: createdArticle.updatedAt
      };
      util.setSuccess(201, 'Article created successfully', response);
      return util.send(res);
    }
  }

  /**
   *
   * @description Method to get all articles
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {object} server response object
   * @memberof Articles
   */
  static async getAllArticles(req, res) {
    const counter = await db.count();
    if (req.offset >= counter) {
      req.offset = 0;
    }
    const { searchQueries, offset, limit } = req;
    const articles = await articleService.getAllArticles(offset, limit, searchQueries);
    if (!articles) {
      util.setError(404, 'That article does not exist!');
      return util.send(res);
    }
    const allArticles = _.map(articles, _.partialRight(_.pick, ['slug', 'title', 'description', 'body', 'taglist', 'favorited', 'favoritedcount', 'flagged', 'images', 'views']));

    allArticles.map((article) => {
      const readTime = Helper.calculateReadTime(article.body);
      article.readtime = readTime;
      return true;
    });
    util.setSuccess(200, 'List of all articles', allArticles);
    return util.send(res);
  }

  /**
   *
   * @description Method to get a specific Article
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {object} server response object
   * @memberof Articles
   */
  static async getOneArticle(req, res) {
    const findArticle = await db.findOne({
      where: { slug: req.params.slug }
    });
    if (!findArticle) {
      util.setError(404, 'That article does not exist!');
      return util.send(res);
    }
    const article = _.pick(findArticle, ['slug', 'title', 'description', 'body', 'taglist', 'favorited', 'favoritedcount', 'flagged', 'images', 'views']);
    const readTime = Helper.calculateReadTime(article.body);
    article.readtime = readTime;
    if (req.auth) {
      const { description } = article;
      const readerId = req.auth.id;
      const item = 'article';
      await statsService.createStat({ description, item, readerId }, 'Stats');
    }
    util.setSuccess(200, 'Article successfully retrieved', article);
    return util.send(res);
  }

  /**
   *
   * @description Method to delete an Article
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {object} server response object
   * @memberof Articles
   */
  static async deleteArticle(req, res) {
    const findArticle = await db.findOne({
      where: { slug: req.params.slug }
    });
    if (!findArticle) {
      util.setError(404, 'That article does not exist!');
      return util.send(res);
    }
    if (req.auth.id !== findArticle.authorId) {
      util.setError(403, 'Sorry you can not DELETE an article that does not belong to you.');
      return util.send(res);
    }
    await db.destroy({
      where: { slug: req.params.slug }
    });
    util.setSuccess(200, 'Article was deleted succussfully!', null);
    return util.send(res);
  }

  /**
   *
   * @description Method to cupdate an Article
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {Object} server response object
   * @memberof Articles
   */
  static async UpdateArticle(req, res) {
    const findArticle = await db.findOne({
      where: { slug: req.params.slug }
    });
    if (!findArticle) {
      util.setError(404, 'That article does not exist!');
      return util.send(res);
    }
    if (req.auth.id !== findArticle.authorId) {
      util.setError(403, 'Sorry you can not UPDATE an article that does not belong to you.');
      return util.send(res);
    }
    const { title, body, description } = req.body;
    const updatedArticle = await articleService.updateArticle(req.params.slug, {
      slug: `${slug(title)}-${uniqid()}`,
      title,
      body,
      description,
      taglist: req.body.taglist.split(' ')
    });
    util.setSuccess(200, 'Article successfully updated', updatedArticle);
    return util.send(res);
  }

  /**
   *
   * @description Method to share article over email and social media channels
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {Object} server response object
   * @memberof Articles
   */
  static async shareArticle(req, res) {
    const article = await db.findOne({
      where: { slug: req.params.slug }
    });

    if (!article) {
      util.setError(404, 'Article is not found.');
      return util.send(res);
    }
    const location = `${process.env.BACKEND_URL}/api/${process.env.API_VERSION}`;
    const url = `${location}/articles/${req.params.slug}`;
    switch (req.params.channel) {
      case 'facebook':
        await OpenUrlHelper.openUrl(`https:www.facebook.com/sharer/sharer.php?u=${url}`);
        util.setSuccess(200, `Article shared to ${req.params.channel}`, url);
        return util.send(res);
      case 'twitter':
        await OpenUrlHelper.openUrl(`https://twitter.com/intent/tweet?url=${url}`);
        util.setSuccess(200, `Article shared to ${req.params.channel}`, url);
        return util.send(res);
      case 'mail':
        await OpenUrlHelper.openUrl(`mailto:?subject=${article.title}&body=${url}`);
        util.setSuccess(200, `Article shared to ${req.params.channel}`, url);
        return util.send(res);
      default:
        break;
    }
  }
}

export default Articles;
