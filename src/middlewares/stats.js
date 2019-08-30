/* eslint-disable require-jsdoc */

import jwt from 'jsonwebtoken';

import StatsService from '../services/db.service';
import { notFound, error } from '../helpers/responses';

const { getStat } = StatsService;

class statsWare {
  static async checkStats(req, res, next) {
    if (!req.auth) {
      return error('you are not logged in').send(res);
    }
    const readerId = req.auth.id;
    const stats = await getStat({ readerId }, 'Stats');
    if (!stats.length) {
      return notFound('reading stats').send(res);
    }
    next();
  }

  static async saveStat(req, res, next) {
    try {
      let token = req.headers['x-access-token'] || req.headers.authorization;
      token = token.slice(7, token.length);
      jwt.verify(token, process.env.SECRET_KEY, (err, decode) => {
        req.auth = decode;
        next();
      });
    } catch (err) {
      next();
    }
  }
}

export default statsWare;
