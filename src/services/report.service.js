import models from '../models';

const db = models.report;

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
  static async getAllReport(offset, limit) {
    try {
      return await db.findAll({
        attributes: {
          exclude: ['id', 'updatedAt']
        },
        include: [{ model: users, username }],
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
   *  @param {*} articlesslug
   * @returns {object} data
   * @memberof articleService
   */
  static async getAllReportForOneArticle(offset, limit, articlesslug) {
    try {
      return await db.findAll({
        where: articlesslug,
        attributes: {
          exclude: ['id', 'updatedAt']
        },
        include: [{ model: users, username }],
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
