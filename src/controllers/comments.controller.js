import commentsService from '../services/comments.service';
import UserService from '../services/user.service';
import models from '../models';
import NotificationServices from '../services/notification.service';
import Util from '../helpers/util';
import StatsService from '../services/db.service';

const util = new Util();

const { notifyUsersWhoFavorited } = NotificationServices;

const CommentsDb = models.Comment;
const database = models.Article;
/**
 *
 *
 * @class Comments
 */
class Comments {
  /**
   *
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {object} data
   * @memberof Comments
   */
  static async createComment(req, res) {
    const userId = req.auth.id;
    const getUser = await UserService.getOneUser(userId);
    const getArticle = await database.findOne({
      where: { slug: req.params.slug }
    });
    if (!getUser) return res.status(404).send({ message: `User with id ${req.auth.id} not found` });
    if (!getArticle) return res.status(404).send({ message: `Article with slug ${req.params.slug}  not found` });
    try {
      const comment = {
        articleSlug: getArticle.slug,
        userId: req.auth.id,
        body: req.body.body,
        parentCommentId: req.body.parentCommentId,
      };
      const createdComment = await commentsService.addComment(comment);
      await notifyUsersWhoFavorited(req, res, getArticle.id, req.params.slug);
      await util.setSuccess(201, 'Comment successfully created', createdComment);
      return util.send(res);
    } catch (error) {
      return res.send({
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
   * @returns {object} data
   * @memberof Comments
   */
  static async deleteComment(req, res) {
    const userId = req.auth.id;
    const getUser = await CommentsDb.findOne({ where: { userId } });
    const commentAuthor = getUser && getUser.get().userId;
    const { id } = req.params;

    if (!Number(id)) {
      await util.setError(400, 'Please provide numeric value');
      return util.send(res);
    }
    if (!(req.auth.id === commentAuthor)) {
      await util.setError(403, 'comment is not yours');
      return util.send(res);
    }
    try {
      const CommentTODelete = await commentsService.deleteComment(id);
      if (CommentTODelete) {
        await util.setSuccess(200, `Comment with id ${id} is successfully deleted`);
        return util.send(res);
      }

      return res.status(404).send({
        status: 404,
        message: `Comment with id ${id} is not found`
      });
    } catch (error) {
      return res.send({
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
   * @returns {object} data
   * @memberof Comments
   */
  static async getComments(req, res) {
    const comments = await CommentsDb.findAll();
    if (!comments) {
      await util.setError(200, 'No comments found');
      return util.send(res);
    }
    const readerId = req.auth.id;
    const item = 'comment';
    await StatsService.createStat({ readerId, item, slug: 'all comments' }, 'Stats');
    await util.setSuccess(200, 'All comments successfully retrieved', comments);
    return util.send(res);
  }

  /**
   *
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {Object} return comment updation message
   * @memberof UserController
   */
  static async updateComment(req, res) {
    const getComment = await CommentsDb.findOne({ where: { id: req.params.id } });
    const gottenComent = getComment && getComment.get().id;
    const { id } = req.params;

    if (!gottenComent) {
      await util.setSuccess(200, 'That comment does not exist');
      return util.send(res);
    }
    if (!Number(id)) {
      await util.setError(400, 'Please provide numeric value');
      return util.send(res);
    }

    const { body } = req.body;
    const commentRevisions = getComment.dataValues.body;
    const updateComment = await commentsService.updateComment(req.params.id, { body, commentRevisions });
    await util.setSuccess(200, 'Update is successfully', updateComment);
    return util.send(res);
  }
}
export default Comments;
