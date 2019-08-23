import models from '../models/index';

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
      if (!foundArticle) return res.status(404).json({ error: 'Article not found' });

      await Favorites.findOrCreate({
        where: { articleId, userId },
        attributes: ['id', 'articleId', 'userId']
      }).spread(async (favorite, created) => {
        if (created) {
          return res.status(200).json({
            message: 'Article favorited successfully'
          });
        }
        await favorite.destroy({ force: true });
        return res.status(200).json({ message: 'Favorite removed successfully' });
      });
    } catch (error) {
      return (error);
    }
  }
}
export default FavoritesController;
