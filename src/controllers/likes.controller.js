import likeService from '../services/likes.service';
import Util from '../helpers/util';

const util = new Util();
/**
 * @class ArticleController
 * @description Handles all related articles functionalities
 * */
class LikesController {
  /**
 *
 * @description Method for unliking an article you previously liked
 * @static
 * @param {object} req client request
 * @param {object} res server response
 * @returns {Object} server response object
 * @memberof LikesController
 */
  static async unlike(req, res) {
    try {
      if (req.body.likeId) {
        const prof = {
          status: 'neutral',
          claps: 0,
        };
        const like = await likeService.updateLikes(prof, req.body.likeId);
        const newLike = {
          status: like[1].status,
          claps: like[1].claps,
          ArticleSlug: like[1].ArticleSlug,
        };
        util.setSuccess(200, 'Successfully unliked', newLike);
        return util.send(res);
      }
      util.setError(401, 'you cant unlike article you did not like');
      return util.send(res);
    } catch (error) {
      util.setError(500, 'server error contact admin');
      return util.send(res);
    }
  }

  /**
 *
 * @description Method for disliking an article
 * @static
 * @param {object} req client request
 * @param {object} res server response
 * @returns {Object} server response object
 * @memberof LikesController
 */
  static async dislike(req, res) {
    try {
      if (req.body.author === req.body.userId) {
        util.setError(401, 'You can not dislike to your own post');
        return util.send(res);
      }
      if (!req.body.likeId) {
        const prof = {
          userId: req.body.userId,
          ArticleSlug: req.params.Article,
          status: 'dislike',
          claps: 0,
        };
        const like = await likeService.createLikes(prof);
        const newLike = {
          status: like.status,
          claps: like.claps,
          ArticleSlug: like.ArticleSlug,
        };
        util.setSuccess(200, 'Successfully disliked', newLike);
        return util.send(res);
      }
      const prof = {
        status: 'dislike',
        claps: 0,
      };
      if (req.body.status === 'dislike') {
        prof.status = 'neutral';
      }
      const like = await likeService.updateLikes(prof, req.body.likeId);
      const newLike = {
        status: like[1].status,
        claps: like[1].claps,
        ArticleSlug: like[1].ArticleSlug,
      };
      util.setSuccess(200, 'Successfully disliked', newLike);
      return util.send(res);
    } catch (error) {
      util.setError(500, 'server error contact admin');
      return util.send(res);
    }
  }

  /**
 *
 * @description Method for clapping for an article
 * @static
 * @param {object} req client request
 * @param {object} res server response
 * @returns {Object} server response object
 * @memberof LikesController
 */
  static async clap(req, res) {
    try {
      if (req.body.author === req.body.userId) {
        util.setError(401, 'You can not clap to your own post');
        return util.send(res);
      }
      if (req.body.likeId) {
        const prof = {
          status: 'like',
          claps: req.body.claps + 1,
        };
        const like = await likeService.updateLikes(prof, req.body.likeId);
        const newLike = {
          status: like[1].status,
          claps: like[1].claps,
          ArticleSlug: like[1].ArticleSlug,
        };
        util.setSuccess(200, 'Successfully claped', newLike);
        return util.send(res);
      }
      const prof = {
        userId: req.body.userId,
        ArticleSlug: req.params.Article,
        status: 'like',
        claps: 1,
      };
      const like = await likeService.createLikes(prof);
      const newLike = {
        status: like.status,
        claps: like.claps,
        ArticleSlug: like.ArticleSlug,
      };
      util.setSuccess(200, 'Successfully claped', newLike);
      return util.send(res);
    } catch (error) {
      util.setError(500, 'server error contact admin');
      return util.send(res);
    }
  }

  /**
 *
 * @description Method for getting all dislikes
 * @static
 * @param {object} req client request
 * @param {object} res server response
 * @returns {Object} server response object
 * @memberof LikesController
 */
  static async getDislikes(req, res) {
    try {
      const dislike = await likeService.getAllADislike(req.params.Article);
      if (dislike) {
        const data = {
          dislikes: dislike.count,
        };
        util.setSuccess(200, 'Dislike retrieved successfully', data);
        return util.send(res);
      }
    } catch (error) {
      util.setError(400, 'server error contact admin');
      return util.send(res);
    }
  }

  /**
 *
 * @description Method for getting all claps for an article
 * @static
 * @param {object} req client request
 * @param {object} res server response
 * @returns {Object} server response object
 * @memberof LikesController
 */
  static async getClaps(req, res) {
    try {
      const claps = await likeService.getAllAClaps(req.params.Article);
      if (claps) {
        const data = {
          clapers: claps.count,
          claps: Object.values(claps)[1],
        };
        util.setSuccess(200, 'Claps retrieved successfully', data);
        return util.send(res);
      }
    } catch (error) {
      util.setError(400, 'server error contact admin');
      return util.send(res);
    }
  }
}

export default LikesController;
