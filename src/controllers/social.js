import User from '../services/user.service';
import Helper from '../helpers/helper';

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
    data = req.user;
    const firstname = data.name ? data.name.givenName : data.displayName.split(' ')[0];
    const lastname = data.name ? data.name.middleName || data.name.familyName : data.displayName.split(' ')[1];
    const email = data.emails ? data.emails[0].value : '';
    const username = `${firstname}.${lastname}`;
    // check if user is in db
    const registeredUser = await User.findOne(email, username);
    if (registeredUser) {
      user = registeredUser;
      message = 'Logged in successfully';
    } else {
      const password = Helper.hashPassword('password');
      const newUser = {
        firstname, lastname, email, username, password
      };
      user = await User.addUser(newUser);
      message = 'login successful, account created with password password,please chane password on next login';
    }
    const payload = {
      id: user.id,
      email,
      role: user.role,
      verified: user.verified
    };
    const token = Helper.generateToken(payload);
    return res.status(200).json({
      status: 200,
      message,
      data: {
        firstname, lastname, username, email
      },
      token
    });
  }
}

export default Social;

