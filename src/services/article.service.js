import models from '../models';

const db = models.Article;

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
   * @returns {object} data
   * @memberof articleService
   */
  static async getAllArticles() {
    try {
      return await db.findAll();
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
}

export default articleService;
