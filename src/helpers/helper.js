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
   * Generate Token
   * @param {string} payload
   * @param {string} expiresInPeriod
   * @returns {string} token
   */
  static generateToken(payload, expiresInPeriod) {
    const expiresInTime = expiresInPeriod || (24 * 60 * 60);
    const token = jwt.sign(payload,
      process.env.SECRET_KEY, { expiresIn: expiresInTime });
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
   *
   *
   * @static
   * @param {*} body
   * @returns {integer} word count
   * @memberof Helper
   */
  static countWords(body) {
    // regex meaning:
    // ^  -->  Match any character that is not the set in this case (\s)
    // \s -->   Matches any whitespace character (spaces, tabs, line breaks)
    // /g -->  Search everyting
    return (body.match(/[^\s]+/g) || []).length;
  }

  /**
   *
   *
   * @static
   * @param {*} body
   * @returns {string} article read time
   * @memberof Helper
   */
  static calculateReadTime(body) {
    const readingSpeedInWordsPerMinute = 256; // Average reading speed of an adult
    const wordCount = this.countWords(body);
    const readTime = Math.ceil((wordCount / readingSpeedInWordsPerMinute));
    const formatedReadTime = `${readTime} min read`;
    return formatedReadTime;
  }

  /**
   *
   *
   * @static
   * @param {*} likeInfo
   * @returns {string} formarted comment like information
   * @memberof Helper
   */
  static formatLikeInfo(likeInfo) {
    let formattedOutput = 'You';
    const usernames = likeInfo.split(', ');

    if (usernames.length === 2) {
      formattedOutput += ' like this comment';
      return formattedOutput;
    }
    for (let i = 1; i < (usernames.length - 1); i += 1) {
      if (i === 5) break;
      formattedOutput += `, ${usernames[i]} `;
    }

    if (usernames.length < 6) {
      formattedOutput += ' like this comment';
      return formattedOutput;
    }

    formattedOutput += `and ${(usernames.length - 6)} more people like this comment`;
    return formattedOutput;
  }
}
export default Helper;
