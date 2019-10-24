import 'dotenv/config';
import slug from 'slug';
import _ from 'lodash';
import moment from 'moment';
import uniqid from 'uniqid';
import models from '../models';
import Userservice from '../services/user.service';
import articleService from '../services/article.service';
import Helper from '../helpers/helper';
import NotificationServices from '../services/notification.service';
// import cloudinaryHelper from '../helpers/cloudinaryHelper';
import OpenUrlHelper from '../helpers/share.article.helper';
import Util from '../helpers/util';
import statsService from '../services/db.service';
import likeService from '../services/likes.service';
import RateService from '../services/rate.service';

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
    // const images = await cloudinaryHelper.generateCloudinaryUrl(req.files);
    const { images } = req.body;

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
    const counter = await db.count();
    if (req.offset >= counter) {
      req.offset = 0;
    }
    const { searchQueries, offset, limit } = req;
    const articles = await articleService.getAllArticles(
      offset,
      limit,
      searchQueries
    );
    if (!articles) {
      return res
        .status(200)
        .json({ status: 200, message: 'There is no article.' });
    }

    const allArticles = _.map(
      articles,
      _.partialRight(_.pick, [
        'authorId',
        'id',
        'slug',
        'title',
        'description',
        'body',
        'taglist',
        'favorited',
        'favoritedcount',
        'flagged',
        'images',
        'views',
        'createdAt'
      ])
    );

    await Promise.all(
      allArticles.map(async (article) => {
        try {
          const userDetails = await Userservice.getOneUser(article.authorId);
          const {
            username, firstname, lastname, image
          } = userDetails;
          const user = {
            username,
            firstname,
            lastname,
            image
          };
          const rating = await RateService.getArticleRatingStatistic(article.slug);
          let claps = await likeService.getAllAClaps(req.params.Article);
          claps = Object.values(claps)[0];
          const readTime = Helper.calculateReadTime(article.body);
          const timeAgo = moment(article.createdAt).fromNow();
          article.readtime = readTime;
          article.username = username;
          article.userImage = image;
          article.timeCreated = timeAgo;
          article.claps = claps;
          article.rating = rating.dataValues.rating;
          article.author = user;
          return true;
        } catch (error) {
          throw error;
        }
      })
    );
    const popularArticles = allArticles.slice(0);
    popularArticles.sort((a, b) => b.views - a.views);
    const mostPopular = popularArticles.slice(0, 9);

    if (req.query.popular) {
      util.setSuccess(
        200,
        'The most popular articles on authors haven',
        mostPopular
      );
      return util.send(res);
    }
    return res.status(200).json({
      status: 200,
      message: 'List of all articles',
      allArticle: counter,
      data: allArticles
    });
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
  static async SpecificUserArticles(req, res) {
    const findArticles = await db.findAll({
      where: { authorId: req.auth.id }
    });

    if (!findArticles) {
      return res.status(200).send({
        message: 'no articles'
      });
    }
    const FoundArticles = _.map(
      findArticles,
      _.partialRight(_.pick, [
        'authorId',
        'slug',
        'id',
        'title',
        'description',
        'body',
        'taglist',
        'favorited',
        'favoritedcount',
        'flagged',
        'images',
        'views',
        'createdAt'
      ])
    );
    await Promise.all(
      FoundArticles.map(async (value) => {
        try {
          const userDetails = await Userservice.getOneUser(value.authorId);
          const { username, image } = userDetails;
          const readTime = Helper.calculateReadTime(value.body);
          const timeAgo = moment(value.createdAt).fromNow();
          value.readtime = readTime;
          value.username = username;
          value.userImage = image;
          value.timeCreated = timeAgo;
          return true;
        } catch (error) {
          throw error;
        }
      })
    );

    return res.status(200).send({
      data: FoundArticles
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

    const article = _.pick(findArticle, [
      'authorId',
      'slug',
      'title',
      'id',
      'description',
      'body',
      'taglist',
      'favorited',
      'favoritedcount',
      'flagged',
      'images',
      'views'
    ]);
    const userDetails = await Userservice.getOneUser(article.authorId);
    const {
      username, firstname, lastname, image
    } = userDetails;
    const user = {
      username,
      firstname,
      lastname,
      image
    };
    const timeAgo = moment(article.createdAt).fromNow();
    const readTime = Helper.calculateReadTime(article.body);
    const rating = await RateService.getArticleRatingStatistic(article.slug);
    let claps = await likeService.getAllAClaps(req.params.Article);
    claps = Object.values(claps)[0];
    article.readtime = readTime;
    article.createdAt = timeAgo;
    article.rating = rating.dataValues.rating;
    article.claps = claps;
    article.author = user;
    if (req.auth) {
      const { description } = article;
      const readerId = req.auth.id;
      const item = 'article';
      await statsService.createStat({ description, item, readerId }, 'Stats');
    }
    let viewObject = {
      slug: findArticle.slug,
      title: findArticle.title,
      description: findArticle.description,
      body: findArticle.body,
      flagged: findArticle.flagged,
      favorited: findArticle.favorited,
      favoritedcount: findArticle.favoritedcount,
      images: findArticle.images,
      views: 1
    };
    if (findArticle) {
      viewObject = { ...viewObject, views: findArticle.views + 1 };
      await db.update(viewObject, {
        where: {
          id: findArticle.id
        },
        returing: true
      });
    } else {
      await db.create(viewObject);
    }
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
    util.setSuccess(200, 'Article was deleted succussfully!');
    return util.send(res);
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
      util.setError(404, 'That article does not exist!');
      return util.send(res);
    }
    if (req.auth.id !== findArticle.authorId) {
      util.setError(401, 'Sorry you can not UPDATE an article that does not belong to you.');
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
    util.setSuccess(200, 'Article Updated successfully!', updatedArticle);
    return util.send(res);
  }

  /**
   *
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {Object} share article over email and social media channelds
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
        await OpenUrlHelper.openUrl(
          `https:www.facebook.com/sharer/sharer.php?u=${url}`
        );
        util.setSuccess(200, `Article shared to ${req.params.channel}`, url);
        return util.send(res);
      case 'twitter':
        await OpenUrlHelper.openUrl(
          `https://twitter.com/intent/tweet?url=${url}`
        );
        util.setSuccess(200, `Article shared to ${req.params.channel}`, url);
        return util.send(res);
      case 'mail':
        await OpenUrlHelper.openUrl(
          `mailto:?subject=${article.title}&body=${url}`
        );
        util.setSuccess(200, `Article shared to ${req.params.channel}`, url);
        return util.send(res);
      default:
        break;
    }
  }
}

export default Articles;
