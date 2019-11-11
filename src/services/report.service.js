import models from '../models';

const db = models.reporting;

/**
 *
 *
 * @class articleService
 */
class ReportService {
  /**
   *
   *
   * @static
   * @param {*} report
   * @returns {object} data
   * @memberof articleService
   */
  static async report(report) {
    try {
      return await db.create(report);
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   *
   * @static
   *  @param {*} offset
   *  @param {*} limit
   * @returns {object} data
   * @memberof articleService
   */
  static async getAllReport() {
    try {
      return await db.findAll({
        attributes: {
          exclude: ['updatedAt']
        },
        order: [
          ['createdAt', 'DESC']
        ]
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   *
   * @static
   *  @param {*} offset
   *  @param {*} limit
   *  @param {*} articleSlug
   * @returns {object} data
   * @memberof articleService
   */
  static async getAllReportForOneArticle(offset, limit, articleSlug) {
    try {
      return await db.findAll({
        where: { articleSlug },
        attributes: {
          exclude: ['updatedAt']
        },
        // include: [{ model: users, username }],
        order: [
          ['createdAt', 'DESC']
        ],
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
   *  @param {*} offset
   *  @param {*} limit
   *  @param {*} userId
   * @returns {object} data
   * @memberof articleService
   */
  static async getMyReport(offset, limit, userId) {
    try {
      return await db.findAll({
        where: { userId },
        attributes: {
          exclude: ['updatedAt', 'userId']
        },
        order: [
          ['createdAt', 'DESC']
        ],
        offset,
        limit,
      });
    } catch (error) {
      throw error;
    }
  }
}

export default ReportService;
