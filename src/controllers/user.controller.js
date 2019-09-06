import UserService from '../services/user.service';
import Helper from '../helpers/helper';
import EmailHelper from '../helpers/verification-email';
import sendPasswordResetEmailHelper from '../services/resetpassword.service';
import Util from '../helpers/util';

const util = new Util();

/**
 *
 *
 * @class UserController
 */
class UserController {
  /**
   *
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {Object} return login information to user
   * @memberof UserController
   */
  static async login(req, res) {
    try {
      let theUser;

      if (req.body.email) {
        theUser = await UserService.findOne(req.body.email, '');
      } else {
        theUser = await UserService.findOne('', req.body.username);
      }

      if (!theUser) {
        util.setError(404, 'Cannot find User with the email or username');
        return util.send(res);
      }
      const validPassword = await Helper.comparePassword(theUser.password, req.body.password);
      if (!validPassword) {
        util.setError(401, 'Password is not correct');
        return util.send(res);
      }
      if (!theUser.verified) {
        util.setError(401, 'User verification not completed. Confirm your email address');
        return util.send(res);
      }

      const payload = {
        id: theUser.id,
        email: theUser.email,
        username: theUser.username,
        role: theUser.role,
        verified: theUser.verified
      };
      const token = await Helper.generateToken(payload);
      return res.status(200).send({
        message: `welcome back ${theUser.firstname}`,
        token
      });
    } catch (error) {
      util.setError(404, error.message);
      return util.send(res);
    }
  }

  /**
   *
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {Object} return user registration informations
   * @memberof UserController
   */
  static async createAdmin(req, res) {
    try {
      const theUser = await UserService.findOne(req.body.email, '');
      const theUserName = await UserService.findOne('', req.body.username);
      if (theUser) {
        util.setError(409, `Cannot register admin with an email ${req.body.email} which is already in use.`);
        return util.send(res);
      }
      if (theUserName) {
        util.setError(409, `Cannot register admin with the username ${
          req.body.username
        } which is already in use.`);
        return util.send(res);
      }
      const hashPassword = await Helper.hashPassword(req.body.password);
      if (!hashPassword) {
        util.setError(401, 'occur error while hashing');
        return util.send(res);
      }
      const {
        firstname, lastname, email, role, username
      } = req.body;
      const newUser = {
        firstname,
        lastname,
        email: email.toLowerCase(),
        password: hashPassword,
        role,
        username
      };
      const createdUser = await UserService.addUser(newUser);
      const payload = {
        id: createdUser.id,
        email: createdUser.email,
        role: createdUser.role,
        verified: createdUser.verified
      };
      const token = await Helper.generateToken(payload);
      const verifyUrl = `${process.env.BACKEND_URL}/api/${process.env.API_VERSION}/users/verify?
      token=${token}`;
      const verify = EmailHelper.sendEmail(payload.email, username, verifyUrl);

      return verify
        ? res.status(201).json({
          status: 201,
          message: 'successfully created account ',
          data: {
            firstname,
            lastname,
            username,
            email
          },
          token
        })
        : 'No verified';
    } catch (error) {
      util.setError(404, error.message);
      return util.send(res);
    }
  }

  /**
   *
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {Object} return normal user registration informations
   * @memberof UserController
   */
  static async signup(req, res) {
    const newUser = req.body;
    newUser.email = req.body.email.toLowerCase();
    try {
      const theUser = await UserService.findOne(req.body.email, '');
      if (theUser) {
        util.setError(409, 'An account with this email already exists');
        return util.send(res);
      }
      const hashPassword = await Helper.hashPassword(req.body.password);
      if (!hashPassword) {
        util.setError(401, 'occur error while hashing');
        return util.send(res);
      }
      req.body.password = hashPassword;
      const createdUser = await UserService.addUser(newUser);
      const { firstname, lastname, email } = createdUser;
      const payload = {
        id: createdUser.id,
        email: createdUser.email,
        role: createdUser.role,
        verified: createdUser.verified
      };
      const token = await Helper.generateToken(payload);
      const verifyUrl = `${process.env.BACKEND_URL}/api/${
        process.env.API_VERSION
      }/users/verify?token=${token}`;
      await EmailHelper.sendEmail(payload.email, newUser.username, verifyUrl);
      return res.status(201).json({
        status: 201,
        message:
          'Your account has been successfully created. An email has been sent to you with detailed instructions on how to activate it.',
        data: { firstname, lastname, email },
        token
      });
    } catch (error) {
      util.setError(404, error.message);
      return util.send(res);
    }
  }

  /**
   *
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {Object} return all users informations
   * @memberof UserController
   */
  static async getAllUsers(req, res) {
    try {
      const allUsers = await UserService.getAllUsers();
      if (allUsers) {
        util.setSuccess(200, 'All users successfully retrieved', allUsers);
        return util.send(res);
      }

      util.setSuccess(200, 'no users found', null);
      return util.send(res);
    } catch (error) {
      util.setError(400, error.message);
      return util.send(res);
    }
  }

  /**
   *
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {Object} returns single user informations
   * @memberof UserController
   */
  static async getOneUser(req, res) {
    const { id } = req.params;
    if (!Number(id)) {
      util.setError(400, 'Please input a valid numeric value');
      return util.send(res);
    }
    try {
      const theUser = await UserService.getOneUser(id);
      if (!theUser) {
        util.setError(404, `Can not find the user with id ${id}`);
        return util.send(res);
      }

      util.setSuccess(200, `User with id ${id} Found`, theUser);
      return util.send(res);
    } catch (error) {
      util.setError(400, error.message);
      return util.send(res);
    }
  }

  /**
   *
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {Object} return deleting message
   * @memberof UserController
   */
  static async deleteUser(req, res) {
    const { id } = req.params;
    if (!Number(id)) {
      util.setError(400, 'Please provide numeric value');
      return util.send(res);
    }
    try {
      const UserTODelete = await UserService.deleteUser(id);
      if (UserTODelete) {
        util.setSuccess(200, `User with id ${id} is successfully deleted`);
        return util.send(res);
      }

      util.setError(404, `User with id ${id} is not found`);
      return util.send(res);
    } catch (error) {
      return res.send({
        message: error.message
      });
    }
  }

  /**
   *
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {Object} return user updation message
   * @memberof UserController
   */
  static async updateUser(req, res) {
    const alteredUser = req.body;
    const { email } = req.params;
    if (!email) {
      util.setError(400, 'Please provide invalid numeric value');
      return util.send(res);
    }
    try {
      const updateUser = await UserService.updateUser(email, alteredUser);
      if (!updateUser) {
        util.setError(404, `User with email ${email} is not not found `);
        return util.send(res);
      }

      util.setSuccess(200, `User with email ${email} is updated successfully`, updateUser);
      return util.send(res);
    } catch (error) {
      util.setError(404, error.message);
      return util.send(res);
    }
  }

  /**
   *
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {Object} signout confirmation message
   * @memberof UserController
   */
  static async signoutUser(req, res) {
    const { token } = req;
    const identifier = token.match(/\d+/g).join(''); // Extract numbers only from token to be used to uniquely identify a token in db
    const invalidToken = await Helper.hashPassword(token);
    const schema = { identifier, invalidToken };
    const rejectedToken = await UserService.createDroppedToken(schema);

    util.setSuccess(200, 'Successfully logged out.', rejectedToken);
    return util.send(res);
  }

  /**
   *
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {Object} json data
   * @memberof UserController
   */
  static async requestPasswordReset(req, res) {
    // check if email provided exists in db
    const { email } = req.body;
    if (!email) {
      util.setError(400, 'Please provide an email address');
      return util.send(res);
    }
    try {
      const user = await UserService.findOne(email, '');
      if (!user) {
        util.setError(400, `User with email ${email} is not not found `);
        return util.send(res);
      }
      // generate token
      const payload = {
        email: user.email,
        role: user.role
      };

      const token = await Helper.generateToken(payload, (60 * 60));
      // create password reset link
      const resetUrl = `${process.env.BACKEND_URL}/api/${process.env.API_VERSION}/users/reset/${token}`;

      // send email to user email address
      const emailSent = await sendPasswordResetEmailHelper.sendEmail(user.email, user.username, resetUrl);
      if (!emailSent) {
        util.setError(500, 'Failed to send email. Please contact site administrator for support');
        return util.send(res);
      }
      util.setSuccess(200, 'Check your email address to reset your password');
      return util.send(res);
    } catch (error) {
      util.setError(500, error.message);
      return util.send(res);
    }
  }

  /**
   *
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {Object} json data
   * @memberof UserController
   */
  static async handlePasswordReset(req, res) {
    // verify token and if its not expired
    const { token } = req.params;
    const tokenDecoded = Helper.verifyToken(token);
    if (tokenDecoded === 'invalid token') {
      util.setError(400, 'Invalid token or Token expired');
      return util.send(res);
    }

    // check if payload's email address exists in database
    const { email } = tokenDecoded;
    const user = await UserService.findOne(email, '');
    if (!user) {
      util.setError(400, `User with email ${email} is not not found `);
      return util.send(res);
    }

    // check if old password equals new password
    const checkPassword = await Helper.comparePassword(user.password, req.body.password);
    if (checkPassword) {
      util.setError(400, 'New password cannot be the same as current password');
      return util.send(res);
    }

    // update password
    const newPassword = req.body.password;
    const password = await Helper.hashPassword(newPassword);
    if (!password) {
      util.setError(500, 'An error occured, Contact your administrator');
      return util.send(res);
    }
    try {
      await UserService.updateUser(email, { password });
      util.setSuccess(200, 'Password reset successfully');
      return util.send(res);
    } catch (error) {
      util.setSuccess(400, 'Failed to fetch user');
      return util.send(res);
    }
  }
}

export default UserController;
