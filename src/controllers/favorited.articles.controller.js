import models from '../models/index';
import Util from '../helpers/util';

const util = new Util();

const { user, Favorites, Article } = models;

/**
 * @description A collection of controller methods for handling favorited articles
 * @class ArticleController
 */
class FavoritesController {
  /**
   * @description controller method for favoriting an article
   * @static
   * @param {object} req Request object
   * @param {object} res Response object
   * @returns {Object} a response object
   */
  static async createOrRemoveFavorite(req, res) {
    try {
      const userDetails = await user.findOne({ where: { email: req.auth.email } });
      const userId = userDetails.id;
      const { articleId } = req.params;

      const foundArticle = await Article.findOne({ where: { id: articleId } });
      if (!foundArticle) {
        util.setError(404, 'Article not found');
        return util.send(res);
      }

      await Favorites.findOrCreate({
        where: { articleId, userId },
        attributes: ['id', 'articleId', 'userId']
      }).spread(async (favorite, created) => {
        if (created) {
          util.setSuccess(200, 'Article favorited successfully', { articleId });
          return util.send(res);
        }
        await favorite.destroy({ force: true });
        util.setSuccess(200, 'Favorite removed successfully', { articleId });
        return util.send(res);
      });
    } catch (error) {
      util.setError(400, error.message);
      return util.send(res);
    }
  }
}
export default FavoritesController;
