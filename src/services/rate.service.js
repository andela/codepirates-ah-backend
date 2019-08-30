import Sequelize from 'sequelize';
import models from '../models';

const db = models.Rate;
/**
 *
 *
 * @class RateService
 */
class RateService {
  /**
  *
  *
  * @static
  * @param {*} offset
  * @param {*} limit
  * @param {*} articleSlug
  * @memberof RateService
  *  @returns {Object} return db result object

   */
  static async getAll(offset, limit) {
    try {
      return await db.findAll({
        offset,
        limit,
      });
    } catch (error) {
      throw error;
    }
  }

  /**
  *
  *
  * @static
  * @param {*} articleSlug
  * @memberof RateService
  *  @returns {Object} return db result object

   */
  static async getArticleRatingStatistic(articleSlug) {
    try {
      return await db.findAll({
        where: { articleSlug },
        returning: true,
        plain: true,
        attributes: [[Sequelize.fn('AVG', Sequelize.col('rate')), 'rating']],
      });
    } catch (error) {
      throw error;
    }
  }

  /**
  *
  *
  * @static
  * @param {*} rate
  * @returns
  * @memberof RateService
  * @returns {Object} return db result object
  */
  static async create(rate) {
    try {
      return await db.create(rate);
    } catch (error) {
      throw error;
    }
  }

  /**
  *
  *
  * @static
  *  @param {*} articleSlug
  * @param {*} limit
  * @param {*} offset
  * @returns
  * @memberof RateService
  * @returns {Object} return db result object
  */
  static async findArticlesRatings(articleSlug, limit, offset) {
    try {
      return await db.findAll({
        where: { articleSlug },
        offset,
        limit,
      });
    } catch (error) {
      throw error;
    }
  }

  /**
  *
  *
  * @static
  *  @param {*} updateRate
  * @returns
  * @memberof RateService
  * @returns {Object} return db result object
  */
  static async update(updateRate) {
    const { articleSlug, userEmail, rate } = updateRate;

    try {
      return await db.update(
        {
          rate: Number(rate)
        },
        { where: { articleSlug, userEmail }, returning: true, plain: true }
      );
    } catch (error) {
      throw error;
    }
  }
}

export default RateService;
