import 'dotenv/config';
import { Highlight } from '../models';
import Helper from '../services/article.service';
import Util from '../helpers/util';

const util = new Util();

/**
 *
 *
 * @class HighlightText
 */
class HighlightText {
  /**
   *
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @returns { object } highlightedText commnet object
   * @memberof HighlightText
   */
  static async bodyHighlightedText(req, res) {
    try {
      const [{ id: userId }, { slug }, { startIndex, endIndex }] = [req.auth, req.params, req.query];
      const start = Number(startIndex);
      const end = Number(endIndex);
      if ((Number.isNaN(start)) || Number.isNaN(end)) {
        util.setError(400, `${startIndex} and ${endIndex} should be a number`);
        return util.send(res);
      }
      const findArticle = await Helper.getOneArticle(slug);
      if (findArticle === null || (findArticle.length === 0)) {
        util.setError(404, 'Sorry, that article does not exists');
        return util.send(res);
      }
      const { id: articleId, body } = findArticle;

      if (((start < 0) || (start > body.length)) || ((end < 0) || (end > body.length))) {
        util.setError(400, `Sorry, ${start} and ${end} should be in the range of the body length.`);
        return util.send(res);
      }
      const text = body.slice(Math.min(start, end), Math.max(start, end));
      if (text.length === 0) {
        util.setError(404, 'Sorry you can not highlight or comment on an empty highlight');
        return util.send(res);
      }
      const highlightedContent = {
        articleId,
        userId,
        text,
        comment: req.body.comment,
        startindex: start,
        endindex: end
      };

      const results = await Helper.addHighlight(highlightedContent);
      util.setSuccess(201, 'Success highligt and comment', results);
      return util.send(res);
    } catch (error) {
      throw (error);
    }
  }

  /**
   *
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @return {*} obeject of successful share
   * @memberof HighlightText
   */
  static async shareHightlight(req, res) {
    try {
      util.setSuccess(201, 'You are ready to share', true);
      return util.send(res);
    } catch (error) {
      throw (error);
    }
  }

  /**
   *
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {object} marked highlighted text
   * @memberof HighlightText
   */
  static async deleteHighlightComment(req, res) {
    try {
      const [{ id: userId }, { id }] = [req.auth, req.params];
      const findHighlight = await Highlight.findOne({ where: { id } });

      if ((findHighlight === null) || (findHighlight.length === 0)) {
        util.setError(404, 'Sorry that highlight does not exists');
        return util.send(res);
      }
      if (findHighlight.comment === null) {
        util.setError(404, 'Sorry comment not found');
        return util.send(res);
      }
      const deleteHighlight = await Highlight.update({ comment: null }, { where: { id, userId }, returning: true });
      if (deleteHighlight[0]) {
        util.setSuccess(200, 'Successfully updated', deleteHighlight[1][0]);
        return util.send(res);
      }
      util.setError(400, 'Sorry you can not delete this comment');
      return util.send(res);
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @return {object} list of all user highlights
   * @memberof HighlightText
   */
  static async getHighlights(req, res) {
    const [{ id: userId }, { articleId }] = [req.auth, req.params];
    const getAll = await Highlight.findAll({ where: { userId, articleId }, returning: true });
    if (getAll[0]) {
      util.setSuccess(200, 'All highlights of this article', getAll);
      return util.send(res);
    }
    util.setError(400, 'Sorry, you are not authorized to access these highlights');
    return util.send(res);
  }
}
export default HighlightText;
