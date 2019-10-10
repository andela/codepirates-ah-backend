import dotenv from 'dotenv';
import User from '../services/user.service';
import Helper from '../helpers/helper';
import randPass from '../helpers/passwordgen';
import dbService from '../services/db.service';

dotenv.config();

let data;

/**
 *
 *
 * @class Social
 */
class Social {
  /**
   *
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {Object} returns access token and user information
   * @memberof Social
   */
  static async login(req, res) {
    data = req.user;
    const type = data.provider;
    try {
      let user;
      let registeredUser;
      const firstname = data.name ? data.name.givenName : data.displayName.split(' ')[0];
      const lastname = data.name ? data.name.middleName || data.name.familyName : data.displayName.split(' ')[1];
      const email = data.emails ? data.emails[0].value : '';
      const image = data.photos ? data.photos[0].value : '';
      const username = `${firstname}.${lastname}.${type}`;
      const tempUser = await User.findOne(email, username);
      if (type === 'twitter') {
        registeredUser = await dbService.getStat({
          firstname: lastname.toLowerCase(), lastname: firstname.toLowerCase()
        }, 'user')[0] || tempUser;
      } else {
        registeredUser = tempUser;
      }
      if (registeredUser) {
        user = registeredUser;
      } else {
        const pass = randPass();
        const password = Helper.hashPassword(pass);
        const verified = true;
        const newUser = {
          firstname, lastname, email, username, password, verified, image
        };
        user = await User.addUser(newUser);
      }
      const payload = {
        id: user.id,
        email,
        role: user.role,
        verified: user.verified
      };
      const token = Helper.generateToken(payload);
      return res.redirect(`${process.env.FRONT_END_URL}/${type}/social-login?socialToken=${token}`);
    } catch (error) {
      return res.redirect(`${process.env.FRONT_END_URL}/${type}/social-login`);
    }

    // check if user is in db
  }
}

export default Social;
