import StatsService from '../services/db.service';
import Util from '../helpers/util';

const util = new Util();

const { getStat } = StatsService;
/**
 *
 *
 * @class Statistics
 */
class statsController {
  /**
   * @description Method for getting statistics
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {object} server response object
   * @memberof statsController
   */
  static async getStats(req, res) {
    const readerId = req.auth.id;
    const stats = await getStat({ readerId }, 'Stats');
    util.setSuccess(200, 'your reading stats', stats);
    return util.send(res);
  }
}

export default statsController;
