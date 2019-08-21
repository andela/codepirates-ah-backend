import 'dotenv/config';
import slug from 'slug';
import _ from 'lodash';
import uniqid from 'uniqid';
import models from '../models';
import Userservice from '../services/user.service';
import articleService from '../services/article.service';
import Helper from '../helpers/helper';
import cloudinaryHelper from '../helpers/cloudinaryHelper';


const db = models.Article;
/**
 *
 *
 * @class Articles
 */
class Articles {
  /**
   *
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {object} data
   * @memberof Articles
   */
  static async createArticles(req, res) {
    const userId = req.auth.id;
    const findUser = await Userservice.getOneUser(userId);
    const images = await cloudinaryHelper(req.files);

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
      return res.status(201).json({
        status: 201,
        article: {
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
        }
      });
    }
  }

  /**
   *
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {object} articles
   * @memberof Articles
   */
  static async getAllArticles(req, res) {
    let page = parseInt(req.query.page, 10);
    if (isNaN(page) || page < 1) {
      page = 1;
    }
    let limit = parseInt(req.query.limit, 10);
    if (isNaN(limit)) {
      limit = 10;
    } else if (limit > 50) {
      limit = 50;
    } else if (limit < 1) {
      limit = 1;
    }
    const offset = (page - 1) * limit;
    const articles = await articleService.getAllArticles(offset, limit);
    if (!articles) {
      return res.status(200).json({ status: 200, message: 'There is no article.' });
    }
    const allArticles = _.map(articles, _.partialRight(_.pick, ['slug', 'title', 'description', 'body', 'taglist', 'favorited', 'favoritedcount', 'flagged', 'images', 'views']));

    allArticles.map((article) => {
      const readTime = Helper.calculateReadTime(article.body);
      article.readtime = readTime;
      return true;
    });

    return res.status(200).json({
      status: 200,
      message: 'List of all articles',
      data: allArticles
    });
  }

  /**
   *
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {object} article
   * @memberof Articles
   */
  static async getOneArticle(req, res) {
    const findArticle = await db.findOne({
      where: { slug: req.params.slug }
    });
    if (!findArticle) {
      return res.status(200).json({
        status: 200,
        message: 'That article does not exist!'
      });
    }
    const article = _.pick(findArticle, ['slug', 'title', 'description', 'body', 'taglist', 'favorited', 'favoritedcount', 'flagged', 'images', 'views']);
    const readTime = Helper.calculateReadTime(article.body);
    article.readtime = readTime;
    return res.status(200).json({
      status: 200,
      message: 'Article successfully retrieved',
      data: article
    });
  }

  /**
   *
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {object} message
   * @memberof Articles
   */
  static async deleteArticle(req, res) {
    const findArticle = await db.findOne({
      where: { slug: req.params.slug }
    });
    if (!findArticle) {
      return res.status(200).json({
        status: 200,
        message: 'That article does not exist!'
      });
    }
    if (req.auth.id !== findArticle.authorId) {
      return res.status(403).json({
        status: 403,
        message: 'Sorry you can not DELETE an article that does not belong to you.'
      });
    }
    await db.destroy({
      where: { slug: req.params.slug }
    });
    return res.status(200).json({
      status: 200,
      message: 'Article was deleted succussfully!'
    });
  }

  /**
   *
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {Object} updated article details
   * @memberof Articles
   */
  static async UpdateArticle(req, res) {
    const findArticle = await db.findOne({
      where: { slug: req.params.slug }
    });
    if (!findArticle) {
      return res.status(200).json({ status: 200, message: 'That article does not exist' });
    }
    if (req.auth.id !== findArticle.authorId) {
      return res.status(403).json({
        status: 403,
        message: 'Sorry you can not UPDATE an article that does not belong to you.'
      });
    }
    const { title, body, description } = req.body;
    const updatedArticle = await articleService.updateArticle(req.params.slug, {
      slug: `${slug(title)}-${uniqid()}`,
      title,
      body,
      description,
      taglist: req.body.taglist.split(' ')
    });
    return res.status(200).json({
      status: 200,
      updatedArticle
    });
  }
}

export default Articles;
