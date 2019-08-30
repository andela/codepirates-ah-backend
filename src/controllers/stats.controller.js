/* eslint-disable require-jsdoc */
import StatsService from '../services/db.service';
import { success } from '../helpers/responses';

const { getStat } = StatsService;

class statsController {
  static async getStats(req, res) {
    const readerId = req.auth.id;
    const stats = await getStat({ readerId }, 'Stats');
    return success('your reading stats', stats).send(res);
  }
}

export default statsController;
