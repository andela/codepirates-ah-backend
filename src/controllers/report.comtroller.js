import 'dotenv/config';
import models from '../models';
import reportService from '../services/report.service';
import Util from '../helpers/util';

const util = new Util();

const db = models.reporting;
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
    if (counter === 0) {
      util.setError(404, 'No reports found');
      return util.send(res);
    }
    if (req.offset >= counter) {
      req.offset = 0;
    }
    const { offset, limit } = req;
    const reports = await reportService.getAllReport(offset, limit);
    const response = {
      count: counter,
      reports,
    };
    util.setSuccess(200, 'Reports retrieved successfully', response);
    return util.send(res);
  }

  /**
   *
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {object} Reports
   * @memberof Report
   */
  static async getMyReport(req, res) {
    try {
      const counter = await db.count({ where: { userId: req.auth.id } });
      if (counter === 0) {
        util.setError(404, 'No reports found');
        return util.send(res);
      }
      if (req.offset >= counter) {
        req.offset = 0;
      }
      const { offset, limit } = req;
      const reports = await reportService.getMyReport(offset, limit, req.auth.id,);
      const response = {
        count: counter,
        yourReport: reports,
      };
      util.setSuccess(200, 'Your reports retrieved successfully', response);
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
   * @returns {object} Report for an article
   * @memberof Report
   */
  static async getReportsForArticle(req, res) {
    try {
      const counter = await db.count({ where: { articleSlug: req.params.Article } });
      if (counter === 0) {
        util.setError(404, 'This article is not yet Reported');
        return util.send(res);
      }
      if (req.offset >= counter) {
        req.offset = 0;
      }
      const { offset, limit } = req;
      const articleSlug = req.params.Article;
      const reports = await reportService.getAllReportForOneArticle(offset, limit, articleSlug);
      const response = {
        count: counter,
        reports,
      };
      util.setSuccess(200, 'Reports retrieved successfully', response);
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
   * @returns {object} delete your report
   * @memberof Report
   */
  static async deleteReport(req, res) {
    try {
      const findReport = await db.findOne({
        where: { id: req.params.reportId }
      });
      if (!findReport) {
        util.setError(404, 'That report does not exist!');
        return util.send(res);
      }
      if (req.auth.id !== findReport.userId && req.auth.role !== 'admin') {
        util.setError(403, 'Sorry you have no access to delete this Report.');
        return util.send(res);
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
        userId: req.auth.id,
        articleSlug: req.params.Article
      };
      const reportArticle = await reportService.report(report);
      const newReport = {
        reason: reportArticle.reason,
        articleSlug: reportArticle.articleSlug,
        id: reportArticle.id
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
