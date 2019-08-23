import commentsService from '../services/comments.service';
import UserService from '../services/user.service';
import models from '../models';
import NotificationServices from '../services/notification.service';

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
      return res.status(201).send({
        status: 201,
        message: 'Comment successfully created',
        comment: createdComment
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
  static async deleteComment(req, res) {
    const userId = req.auth.id;
    const getUser = await CommentsDb.findOne({ where: { userId } });
    const commentAuthor = getUser && getUser.get().userId;
    const { id } = req.params;

    if (!Number(id)) {
      return res.status(400).send({
        status: 400,
        message: 'Please provide numeric value'
      });
    }
    if (!(req.auth.id === commentAuthor)) {
      return res.status(403).send({
        status: 403,
        message: 'comment is not yours'
      });
    }
    try {
      const CommentTODelete = await commentsService.deleteComment(id);
      if (CommentTODelete) {
        return res.status(200).send({
          status: 200,
          message: `Comment with id ${id} is successfully deleted`
        });
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
      return res.status(200).send({
        message: 'No comments found'
      });
    }
    return res.status(200).send({
      status: 200,
      message: 'All comments successfully retrieved',
      comments
    });
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
    if (!id) {
      return res.status(400).send({
        status: 400,
        message: 'Please provide valid numeric value'
      });
    }
    if (!gottenComent) {
      return res.status(200).json({ status: 200, message: 'That comment does not exist' });
    }

    const { body } = req.body;
    const updateComment = await commentsService.updateComment(req.params.id, { body });
    return res.status(200).send({
      status: 200,
      message: 'Updation is successfully',
      updateComment
    });
  }
}
export default Comments;
