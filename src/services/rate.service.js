import database from '../models/index';

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
                 * @param {*} articleSlug
                 * @param {*} userEmail
                 * @returns
                 * @memberof RateService
                 * @returns {Object} return db result object
                 */
  static async findOne(articleSlug, userEmail) {
    try {
      return await database.Rate.findOne({
        where: { articleSlug, userEmail }
      });
    } catch (error) {
      throw error;
    }
  }

  /**
                 *
                 *
                 * @static
                 * @returns
                 * @memberof RateService
                 * @returns {Object} return db result object
                 */
  static async getAllRatings() {
    try {
      return await database.Rate.findAll();
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
      return await database.Rate.create(rate);
    } catch (error) {
      throw error;
    }
  }

  /**
                 *
                 *
                 * @static
                 * @param {*} articleSlug
                 * @param {*} userEmail
                 * @param {*} updateRate
                 * @returns
                 * @memberof RateService
                 * @returns {Object} return db result object
                 */
  static async update(articleSlug, userEmail, updateRate) {
    try {
      const rateToUpdate = await database.Rate.findOne({
        where: { articleSlug }
      });

      if (rateToUpdate) {
        await database.user.update(updateRate, { where: { articleSlug, userEmail } });

        return updateRate;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }
}

export default RateService;
