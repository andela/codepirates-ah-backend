import likeService from '../services/likes.service';
import Util from '../helpers/util';

const util = new Util();
/**
 * @author codepirates
 * @exports LikesController
 * @class ArticleController
 * @description Handles all related articles functioanlities
 * */
class LikesController {
  /**
   * @param  {object} req - Request object
   * @param {object} res - Response object
   * @returns {object} response
   *  @static
   */
  static async unlike(req, res) {
    try {
      if (req.body.likeId) {
        const prof = {
          status: 'neutral',
          claps: null,
        };
        const like = await likeService.updateLikes(prof, req.params.Article);
        util.setSuccess(200, 'Successfully unliked', like);
        return util.send(res);
      }
      util.setError(404, 'you cant unlike article you didnt like');
      return util.send(res);
    } catch (error) {
      util.setError(500, 'contact admin');
      return util.send(res);
    }
  }

  /**
   * @param  {object} req - Request object
   * @param {object} res - Response object
   * @returns {object} response
   *  @static
   */
  static async dislike(req, res) {
    try {
      if (!req.body.likeId) {
        const prof = {
          userId: req.body.userId,
          ArticleSlug: req.params.Article,
          status: 'dislike',
          claps: null,
        };
        const like = await likeService.createLikes(prof);
        util.setSuccess(200, 'Successfully disliked', like);
        return util.send(res);
      }
      const prof = {
        status: 'dislike',
        claps: null,
      };
      const like = await likeService.updateLikes(prof, req.body.likeId);
      util.setSuccess(200, 'Successfully disliked', like);
      return util.send(res);
    } catch (error) {
      util.setError(500, 'dislike not successfully server error');
      return util.send(res);
    }
  }

  /**
   * @param  {object} req - Request object
   * @param {object} res - Response object
   * @returns {object} response
   *  @static
   */
  static async clap(req, res) {
    try {
      if (req.body.likeId) {
        const prof = {
          status: 'like',
          claps: req.body.claps + 1,
        };
        const like = await likeService.updateLikes(prof, req.body.likeId);
        util.setSuccess(200, 'Successfully claped', like);
        return util.send(res);
      }
      const prof = {
        userId: req.body.userId,
        ArticleSlug: req.params.Article,
        status: 'like',
        claps: 1,
      };
      const like = await likeService.createLikes(prof);
      util.setSuccess(200, 'Successfully claped', like);
      return util.send(res);
    } catch (error) {
      console.log(error);
      util.setError(500, 'clap not successfully server error');
      return util.send(res);
    }
  }

  /**
   * @param  {object} req - Request object
   * @param {object} res - Response object
   * @returns {object} response
   *  @static
   */
  static async getDislikes(req, res) {
    try {
      const dislike = await likeService.getAllADislike(req.params.parentid);
      if (dislike) {
        util.setSuccess(200, 'Successfully claped', dislike);
        return util.send(res);
      }
      util.setError(404, 'no dislike found');
      return util.send(res);
    } catch (error) {
      util.setError(400, 'unsuccessfull request server error');
      return util.send(res);
    }
  }

  /**
   * @param  {object} req - Request object
   * @param {object} res - Response object
   * @returns {object} response
   *  @static
   */
  static async getClaps(req, res) {
    try {
      const claps = await likeService.getAllAClaps(req.params.parentid);
      if (claps) {
        util.setSuccess(200, 'Successfully claps retrieved', claps);
        return util.send(res);
      }
      util.setError(404, 'no claps found');
      return util.send(res);
    } catch (error) {
      console.log(error);
      util.setError(400, 'unsuccessfull request');
      return util.send(res);
    }
  }
}

export default LikesController;
