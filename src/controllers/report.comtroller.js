import 'dotenv/config';
import models from '../models';
import reportService from '../services/report.service';
import paginate from '../helpers/pagination.helper';
import Util from '../helpers/util';

const util = new Util();

const db = models.Report;
/**
 *
 *
 * @class Report
 */
class Report {
  /**
   *
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {object} Reports
   * @memberof Report
   */
  static async getAllReport(req, res) {
    const counter = await db.count();
    const { offset, limit } = paginate(req.param.page, req.param.limit, counter);

    const reports = await reportService.getAllReport(offset, limit);
    if (!reports) {
      util.setError(200, 'No reports found');
      return util.send(res);
    }
    const data = {
      AllReports: Object.values(reports)[1],
    };
    util.setSuccess(200, 'Reports retrieved successfully', data);
    return util.send(res);
  }

  /**
   *
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {object} Report for an article
   * @memberof Report
   */
  static async getReportsForArticle(req, res) {
    const counter = await db.count({ where: { articleSlug: req.params.req.params.Article } });
    const { offset, limit } = paginate(req.param.page, req.param.limit, counter);
    const articleSlug = req.params.Article;
    const reports = await reportService.getAllReportForOneArticle(offset, limit, articleSlug);
    if (!reports) {
      util.setError(200, 'This article is not Reported');
      return util.send(res);
    }
    const data = {
      AllReports: Object.values(reports)[1],
    };
    util.setSuccess(200, 'Reports retrieved successfully', data);
    return util.send(res);
  }

  /**
   *
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {object} delete your report
   * @memberof Report
   */
  static async deleteReport(req, res) {
    try {
      const findReport = await db.findOne({
        where: { id: req.params.reportId }
      });
      if (!findReport) {
        return res.status(200).json({
          status: 200,
          message: 'That report does not exist!'
        });
      }
      if (req.auth.id !== findReport.userId && req.auth.role !== 'admin') {
        return res.status(403).json({
          status: 403,
          message: 'Sorry you have no access to delete this Report.'
        });
      }
      await db.destroy({
        where: { id: req.params.reportId }
      });
      util.setSuccess(200, 'Report deleted succussfully!');
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
   * @returns {Object} Report an article
   * @memberof Report
   */
  static async reportArticle(req, res) {
    try {
      const report = {
        reason: req.body.reason,
        userId: req.body.userId,
        articleSlug: req.params.Article
      };
      const reportArticle = await reportService.report(report);
      const newReport = {
        reason: reportArticle[1].reason,
        ArticleSlug: reportArticle[1].ArticleSlug,
      };
      util.setSuccess(200, 'Article Successfully reported', newReport);
      return util.send(res);
    } catch (error) {
      util.setError(500, 'server error contact admin');
      return util.send(res);
    }
  }
}

export default Report;
