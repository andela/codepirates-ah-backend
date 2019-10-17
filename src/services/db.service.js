/* eslint-disable require-jsdoc */
import models from '../models';

// const { Stats, Article, user } = models;
// const Models = { Stats, Article, user };
const conditon = where => ({ where });

class StatsService {
  static async createStat(where, model) {
    return models[model].create(where);
  }

  static async getStat(where, model) {
    return models[model].findAll(conditon(where));
  }
}

export default StatsService;
