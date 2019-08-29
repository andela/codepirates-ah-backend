/* eslint-disable require-jsdoc */
import models from '../models';

const { Stats, Article } = models;
const Models = { Stats, Article };
const conditon = where => ({ where });

class StatsService {
  static async createStat(where, model) {
    return Models[model].create(where);
  }

  static async getStat(where, model) {
    return Models[model].findAll(conditon(where));
  }
}

export default StatsService;
