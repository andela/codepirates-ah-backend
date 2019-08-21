import Sequelize from 'sequelize';
import models from '../models';

const db = models.Likes;

/**
 *
 *
 * @class LikeService
 */
class LikeService {
  /**
   *
   *
   * @static
   * @param {*} ArticleSlug
   * @returns {object} data
   * @memberof LikeService
   */
  static async getAllADislike(ArticleSlug) {
    try {
      const dislikes = await db.findAndCountAll({
        where: {
          ArticleSlug: String(ArticleSlug),
          status: 'dislike'
        },
        attributes: {
          exclude: ['id', 'userId', 'createdAt', 'updatedAt', 'status']
        },
        raw: true
      });
      return dislikes;
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   *
   * @static
   * @param {*} ArticleSlug
   * @returns {object} data
   * @memberof LikeService
   */
  static async getAllAClaps(ArticleSlug) {
    try {
      const claps = await db.findAndCountAll({
        where: {
          ArticleSlug: String(ArticleSlug),
          status: 'like'
        },
        attributes: [[Sequelize.fn('sum', Sequelize.col('claps')), 'total']],
      });
      return claps;
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   *
   * @static
   * @param {*} like
   * @param {*} id
   * @returns {Object} return db result object
   * @memberof UserService
   */
  static async updateLikes(like, id) {
    try {
      const { claps, status } = like;
      return await db.update(
        {
          status: String(status),
          claps: Number(claps),
        },
        { where: { id: Number(id) }, returning: true, plain: true }
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   *
   * @static
   * @param {*} like
   * @returns {Object} return db result object
   * @memberof UserService
   */
  static async createLikes(like) {
    try {
      return await db.create(like);
    } catch (error) {
      throw error;
    }
  }
}

export default LikeService;
