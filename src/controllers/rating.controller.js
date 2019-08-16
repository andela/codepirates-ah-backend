import db from '../models/index';
import RateService from '../services/rate.service';
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
  static async setArticleRating(req, res) {
    try {
      // Initialize rating data
      const userEmail = req.auth.email;
      const { rate } = req.body;
      const { articleSlug } = req.params;
      const rateSchema = { userEmail, articleSlug, rate };

      // check if user is trying to rate his/her own article
      const article = await db.Article.findOne({
        where: { slug: articleSlug }
      });
      const user = await db.user.findOne({
        where: { id: article.authorId }
      });
      if (user.email === userEmail) {
        return res.status(400).send({
          status: 400,
          message: 'You cannot rate your own article'
        });
      }

      // create rating
      const createdRate = await RateService.create(rateSchema);
      return res.status(200).send({
        status: 200,
        message: 'Thank you for rating this article',
        data: createdRate
      });
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
     * @memberof UserController
     */
  static async updateArticleRating(req, res) {
    try {
      // Initialize rating data
      const userEmail = req.auth.email;
      const { rate } = req.body;
      const { articleSlug } = req.params;

      // update article rate
      const updatedRate = await RateService.update(articleSlug, userEmail, rate);
      if (!updatedRate) {
        return res.status(400).send({
          status: 400,
          error: `Rating for article with Slug: ${articleSlug} not found`
        });
      }
      return res.status(200).send({
        status: 200,
        message: 'Thank you for rating this article',
        newRating: updatedRate
      });
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
      const userEmail = req.auth.email;
      const { articleSlug } = req.params;

      // find particular rating
      const userRate = await RateService.findOne(articleSlug, userEmail);
      if (!userRate) {
        return res.status(400).send({
          status: 400,
          error: `Rating for article with slug ${articleSlug} not found`,
        });
      }
      return res.status(200).send({
        status: 200,
        message: `Rating for article with slug ${articleSlug} found`,
        data: userRate
      });
    } catch (error) {
      return res.status(404).send({
        status: 404,
        message: error.message
      });
    }
  }
}

export default rateController;
