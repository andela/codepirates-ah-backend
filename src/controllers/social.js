import User from '../services/user.service';
import Helper from '../helpers/helper';
import randPass from '../helpers/passwordgen';
import dbService from '../services/db.service';

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
    let user;
    let message;
    let status = 200;
    let registeredUser;
    data = req.user;
    const firstname = data.name ? data.name.givenName : data.displayName.split(' ')[0];
    const lastname = data.name ? data.name.middleName || data.name.familyName : data.displayName.split(' ')[1];
    const email = data.emails ? data.emails[0].value : '';
    const username = `${firstname}.${lastname}`;
    // check if user is in db
    const tempUser = await User.findOne(email, username);
    if (data.provider === 'twitter') {
      registeredUser = await dbService.getStat({
        firstname: lastname.toLowerCase(), lastname: firstname.toLowerCase()
      }, 'user')[0] || tempUser;
    } else {
      registeredUser = tempUser;
    }
    if (registeredUser) {
      user = registeredUser;
      message = 'Logged in successfully';
    } else {
      const pass = randPass();
      const password = Helper.hashPassword(pass);
      status = 201;
      const newUser = {
        firstname, lastname, email, username, password
      };
      user = await User.addUser(newUser);
      message = `Account created with password ${pass}, please change your password`;
      if (data.provider === 'twitter') {
        message += ' and update your email address';
        console.log('cccc', message);
      }
    }
    const payload = {
      id: user.id,
      email,
      role: user.role,
      verified: user.verified
    };
    const token = Helper.generateToken(payload);
    return res.status(status).json({
      message,
      status,
      token,
      data: {
        firstname, lastname, username, email
      },
    });
  }
}

export default Social;
