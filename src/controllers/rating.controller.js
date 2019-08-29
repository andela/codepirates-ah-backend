import db from '../models';
import RateService from '../services/rate.service';
import Util from '../helpers/util';

// const db = models.Rate;

const util = new Util();
/**
 *
 *
 * @class rateController
 */
class rateController {
  /**
     *
     *
     * @static
     * @param {*} req
     * @param {*} res
     * @returns {Object} return rating information to user
     * @memberof UserController
     */
  static async createOrUpdateRate(req, res) {
    try {
      // Initialize rating data
      const userEmail = req.auth.email;
      const { rate } = req.body;
      const { articleSlug } = req.params;
      const rateSchema = { userEmail, articleSlug, rate };
      let response;
      // check if rate is arleady there
      const isRate = await db.Rate.findOne({
        where: { articleSlug, userEmail }
      });
      // update rate rating
      if (isRate) {
        response = await RateService.update(rateSchema);
      } else {
        // create rating
        response = await RateService.create(rateSchema);
      }
      util.setSuccess(200, 'Successfully rated', response);
      return util.send(res);
    } catch (error) {
      util.setError(500, 'server error contact admin');
      return util.send(res);
    }
  }

  /**
   *
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {Object} return rating information to user
   * @memberof rateController
   */
  static async getAllRating(req, res) {
    try {
      const count = await db.Rate.count();
      if (count === 0) {
        util.setError(404, 'no rate yet made');
        return util.send(res);
      }
      if (req.offset >= count) {
        req.offset = 0;
      }
      const { offset, limit } = req;
      // find particular rating
      const allRates = await RateService.getAll(offset, limit);
      util.setSuccess(200, 'all rates retrieved successfully', allRates);
      return util.send(res);
    } catch (error) {
      return res.status(404).send({
        status: 404,
        message: error.message
      });
    }
  }

  /**
   *
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {Object} return rating information to user
   * @memberof rateController
   */
  static async getArticleRating(req, res) {
    try {
      // Initialize rating data
      const { articleSlug } = req.params;
      // check if rate is arleady there
      const isArticle = await db.Article.findOne({
        where: { slug: articleSlug }
      });
      if (!isArticle) {
        util.setError(404, 'post not found');
        return util.send(res);
      }
      const count = await db.Rate.count({
        where: { articleSlug }
      });
      if (count === 0) {
        util.setError(404, `Rating for article with slug ${articleSlug} not found`);
        return util.send(res);
      }
      const rating = await RateService.getArticleRatingStatistic(articleSlug);
      if (req.offset >= count) {
        req.offset = 0;
      }
      const { offset, limit } = req;
      // find particular rating
      const ArticleRAting = await RateService.findArticlesRatings(articleSlug, limit, offset);
      const response = {
        rating,
        count,
        data: ArticleRAting
      };
      util.setSuccess(200, `Rating for article with slug ${articleSlug} found`, response);
      return util.send(res);
    } catch (error) {
      util.setError(500, 'server error contact admin');
      return util.send(res);
    }
  }
}

export default rateController;
