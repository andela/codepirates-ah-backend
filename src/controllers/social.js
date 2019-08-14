/* eslint-disable require-jsdoc */
import User from '../services/user.service';
import Helper from '../helpers/helper';
import verifyUser from '../helpers/verification-email';

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
    const firstname = data.name ? data.name.givenName : data.displayName.split(' ')[0];
    const lastname = data.name ? data.name.middleName : data.displayName.split(' ')[1];
    const email = data.emails ? data.emails[0].value : '';
    const username = `${firstname}.${lastname}`;
    // check if user is in db
    const registeredUser = await User.findOne(email, username);
    // format response message for case of twitter user without email add and others with
    const message = data.emails ? `account with name ${firstname} ${lastname} does not exist, create?`
      : `account with name ${firstname} ${lastname} does not exist, to register send email in response`;
    // if yes user exists, generate token
    if (registeredUser) {
      const payload = {
        email,
        role: registeredUser.role,
        verified: registeredUser.verified
      };
      const token = Helper.generateToken(payload);
      return res.status(200).json({
        status: 200,
        message: 'Logged in successfully',
        data: {
          firstname, lastname, username, email
        },
        token
      });
    }
    res.status(200).json({ message });
  }

  /**
    *
    *
    * @static
    * @param {*} req
    * @param {*} res
    * @returns {Object} returns new user
    * @memberof Social
    */
  static async signup(req, res) {
    const firstname = data.name ? data.name.givenName : data.displayName.split(' ')[0];
    const lastname = data.name ? data.name.middleName || data.name.familyName : data.displayName.split(' ')[1];
    const email = data.emails ? data.emails[0].value : req.body.email || req.query.email;
    const username = `${firstname}.${lastname}`;
    const hasspassword = Helper.hashPassword('password');
    const dbSchema = {
      firstname, lastname, email, username, password: hasspassword
    };
    const createdUser = await User.addUser(dbSchema);
    const payload = {
      email: createdUser.email,
      role: createdUser.role,
      verified: createdUser.verified
    };
    const token = Helper.generateToken(payload);
    const verifyUrl = `${process.env.BACKEND_URL}/api/${
      process.env.API_VERSION
    }/users/verify?token=${token}`;
    verifyUser(payload.email, createdUser.username, verifyUrl);
    return res.status(201).json({
      status: 201,
      message: 'Your account has been successfully created. An email has been sent to you with detailed instructions on how to activate it. Your default password is password, Please change on activatio',
      data: {
        firstname: createdUser.firstname,
        lastname: createdUser.lastname,
        email: createdUser.email,
        username: createdUser.username,
        role: createdUser.role,
      },
      token,
    });
  }
}

export default Social;
