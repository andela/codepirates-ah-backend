import 'dotenv/config';
import slug from 'slug';
import uniqid from 'uniqid';
import cloudinary from 'cloudinary';
import models from '../models';
import Userservice from '../services/user.service';
import articleService from '../services/article.service';

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
    let images = req.files;
    images = await Promise.all(
      images.map(async (file) => {
        const { secure_url } = await cloudinary.v2.uploader.upload(file.path);
        return secure_url;
      })
    );

    if (findUser) {
      const { title } = req.body;
      const tags = req.body.taglist.split(' ');
      const article = {
        slug: `${slug(title)}-${uniqid()}`,
        title,
        description: req.body.description,
        body: req.body.body,
        taglist: tags,
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
          taglist: createdArticle.taglist,
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
    const articles = await articleService.getAllArticles();
    if (!articles) {
      return res.status(200).json({ status: 200, message: 'There is no article.' });
    }
    return res.status(200).json({
      status: 200,
      message: 'List of all articles',
      articles
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
    return res.status(200).json({
      status: 200,
      findArticle
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
