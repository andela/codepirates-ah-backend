import models from '../models';

const database = models.Comment;
/**
 *
 *
 * @class commentsService
 */
class commentsService {
  /**
   *
   *
   * @static
   * @param {*} comment
   * @returns {object} data
   * @memberof commentsService
   */
  static async addComment(comment) {
    try {
      return await database.create(comment);
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   *
   * @static
   * @param {*} id
   * @returns {object} data
   * @memberof commentsService
   */
  static async deleteComment(id) {
    try {
      const CommentToDelete = await database.findOne({ where: { id: Number(id) } });
      if (CommentToDelete) {
        const deletedComment = await database.destroy({
          where: { id: Number(id) }
        });
        return deletedComment;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   *
   * @static
   * @param {*} id
   * @param {*} updateComments
   * @returns {object} data
   * @memberof commentsService
   */
  static async updateComment(id, updateComments) {
    try {
      const results = await database.update(updateComments, { where: { id }, returning: true });
      return results;
    } catch (error) {
      throw error;
    }
  }
}
export default commentsService;
