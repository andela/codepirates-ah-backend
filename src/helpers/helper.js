import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import env from 'dotenv';

env.config();
/**
 *
 *
 * @class Helper
 */
class Helper {
  /**
   * Hash Password Method
   * @param {string} password
   * @returns {string} returns hashed password
   */
  static hashPassword(password) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
  }

  /**
   * comparePassword
   * @param {string} hashPassword
   * @param {string} password
   * @returns {Boolean} return True or False
   */
  static comparePassword(hashPassword, password) {
    return bcrypt.compareSync(password, hashPassword);
  }

  /**
   * Gnerate Token
   * @param {string} payload
   * @returns {string} token
   */
  static generateToken(payload) {
    const token = jwt.sign(payload,
      process.env.SECRET_KEY);
    return token;
  }

  /**
   * verifyToken
   * @param {string} token
   * @returns {Boolean} return True or False
   */
  static verifyToken(token) {
    try {
      const decode = jwt.verify(token, process.env.SECRET_KEY);
      return decode;
    } catch (error) {
      return error.message;
    }
  }

  /**
   * checks for the existence of any data in the database
   * @param {object} model The database model.
   * @param {object} searchParam The search parameter needed to query the database.
   * @returns {boolean} existing
   */
  static async findRecord(model, searchParam) {
    const existing = await model.findOne({ where: searchParam });
    return existing;
  }
}
export default Helper;
