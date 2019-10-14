import models from '../models';

const db = models.Article;
const highlightDb = models.Highlight;


/**
 *
 *
 * @class articleService
 */
class articleService {
  /**
   *
   *
   * @static
   * @param {*} article
   * @returns {object} data
   * @memberof articleService
   */
  static async addArticle(article) {
    try {
      return await db.create(article);
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
   * @param {*} popular
   *  @param {*} searchQueries
   * @returns {object} data
   * @memberof articleService
   */
  static async getAllArticles(offset, limit, popular, searchQueries) {
    try {
      return await db.findAll({
        where: searchQueries,
        order: [
          ['createdAt', 'DESC']
        ],
        popular,
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
   * @param {*} slug
   * @param {*} fieldToupdate
   * @returns {object} object
   * @memberof articleService
   */
  static async updateArticle(slug, fieldToupdate) {
    try {
      const results = await db.update(fieldToupdate, { where: { slug }, returning: true });
      return results;
    } catch (error) {
      throw error;
    }
  }
  // highlighting part

  /**
   *
   *
   * @static
   * @param {*} slug
   * @returns {object } article
   * @memberof articleService
   */
  static async getOneArticle(slug) {
    try {
      const findOne = await db.findOne({ where: { slug } });
      return findOne;
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   *
   * @static
   * @param {*} highlight
   * @returns {object} highlight object
   * @memberof articleService
   */
  static async addHighlight(highlight) {
    try {
      const createHighlight = await highlightDb.create(highlight);
      return createHighlight;
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   *
   * @static
   * @param {*} id
   * @param {*} startIndex
   * @param {*} endIndex
   * @returns {object} highlight
   * @memberof articleService
   */
  static async findHighlight(id) {
    try {
      const findOneHighlight = await highlightDb.findOne({ where: { id }, include: [{ model: models.Article, as: 'highlight', attributes: ['id', 'slug'] }] });
      return findOneHighlight;
    } catch (error) {
      throw error;
    }
  }
}

export default articleService;
