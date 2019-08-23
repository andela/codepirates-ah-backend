import nodemailer from 'nodemailer';
import UserService from '../services/user.service';
import Helper from '../helpers/helper';
import sendEmail from '../helpers/verification-email';
import resetSendMail from '../services/resetpassword.service';

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
        return res.status(404).send({
          status: 404,
          message: 'Cannot find User with the email or username'
        });
      }
      const validPassword = await Helper.comparePassword(theUser.password, req.body.password);
      if (!validPassword) {
        return res.status(401).send({
          status: 401,
          message: 'Password is not correct'
        });
      }
      if (!theUser.verified) {
        return res.status(401).send({
          status: 401,
          message: 'User verification not completed. Confirm your email address'
        });
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
        status: 200,
        message: `welcome back ${theUser.firstname}`,
        token
      });
    } catch (error) {
      return res.status(404).send({
        status: 404,
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
   * @returns {Object} return user registration informations
   * @memberof UserController
   */
  static async createAdmin(req, res) {
    try {
      const theUser = await UserService.findOne(req.body.email, '');
      const theUserName = await UserService.findOne('', req.body.username);
      if (theUser) {
        return res.status(409).send({
          status: 409,
          message: `Cannot register admin with an email ${req.body.email} which is already in use.`
        });
      }
      if (theUserName) {
        return res.status(409).send({
          status: 409,
          message: `Cannot register admin with the username ${
            req.body.username
          } which is already in use.`
        });
      }
      const hashPassword = await Helper.hashPassword(req.body.password);
      if (!hashPassword) {
        return res.status(401).send({
          status: 401,
          message: 'occur error while hashing'
        });
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
      const verify = sendEmail(payload.email, username, verifyUrl);

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
      const { errors } = error;
      return res.status(404).send({
        status: 404,
        message: errors[0].message
      });
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
        return res.status(409).send({
          status: 409,
          message: 'An account with this email already exists'
        });
      }
      const hashPassword = await Helper.hashPassword(req.body.password);
      if (!hashPassword) {
        return res.status(401).send({
          status: 401,
          message: 'occur error while hashing'
        });
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
      await sendEmail(payload.email, newUser.username, verifyUrl);
      return res.status(201).json({
        status: 201,
        message:
          'Your account has been successfully created. An email has been sent to you with detailed instructions on how to activate it.',
        data: { firstname, lastname, email },
        token
      });
    } catch (error) {
      const { response: { body: { errors } } } = error;
      return res.status(404).send({
        status: 404,
        message: errors[0].message
      });
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
        return res.status(200).send({
          status: 200,
          message: 'All users successfully retrieved',
          data: allUsers
        });
      }

      return res.status(200).send({
        message: 'no users found'
      });
    } catch (error) {
      return res.status(400).send({
        status: 400,
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
   * @returns {Object} returns single user informations
   * @memberof UserController
   */
  static async getOneUser(req, res) {
    const { id } = req.params;
    if (!Number(id)) {
      return res.status(400).send({
        status: 400,
        message: 'Please input a valid numeric value'
      });
    }
    try {
      const theUser = await UserService.getOneUser(id);
      if (!theUser) {
        return res.status(404).send({
          status: 404,
          message: `Can not find the user with id ${id}`
        });
      }

      return res.status(200).send({
        status: 200,
        message: `User with id ${id} Found`,
        data: theUser
      });
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
   * @returns {Object} return deleting message
   * @memberof UserController
   */
  static async deleteUser(req, res) {
    const { id } = req.params;
    if (!Number(id)) {
      return res.status(400).send({
        status: 400,
        message: 'Please provide numeric value'
      });
    }
    try {
      const UserTODelete = await UserService.deleteUser(id);
      if (UserTODelete) {
        return res.status(200).send({
          status: 200,
          message: `User with id ${id} is successfully deleted`
        });
      }

      return res.status(404).send({
        status: 404,
        message: `User with id ${id} is not found`
      });
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
      return res.status(400).send({
        status: 400,
        message: 'Please provide invalid numeric value'
      });
    }
    try {
      const updateUser = await UserService.updateUser(email, alteredUser);
      if (!updateUser) {
        return res.status(404).send({
          status: 404,
          message: `User with email ${email} is not not found `
        });
      }

      return res.status(200).send({
        status: 200,
        message: `User with email ${email} is updated successfully`,
        data: updateUser
      });
    } catch (error) {
      return res.status(404).send({
        status: 404,
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
   * @returns {Object} signout confirmation message
   * @memberof UserController
   */
  static async signoutUser(req, res) {
    const { token } = req;
    const identifier = token.match(/\d+/g).join(''); // Extract numbers only from token to be used to uniquely identify a token in db
    const invalidToken = await Helper.hashPassword(token);
    const schema = { identifier, invalidToken };
    const rejectedToken = await UserService.createDroppedToken(schema);

    return res.status(200).json({
      status: 200,
      message: 'Successfully logged out.',
      data: rejectedToken
    });
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
      return res.status(400).send({
        status: 400,
        message: 'Please provide an email address'
      });
    }
    try {
      const user = await UserService.findOne(email, '');
      if (!user) {
        return res.status(400).send({
          status: 400,
          message: `User with email ${email} is not not found `
        });
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
      const emailSent = resetSendMail(user.email, user.username, resetUrl);

      if (!emailSent) { return res.status(500).send({ status: 500, message: 'Failed to send email. Please contact site administrator for support' }); }

      return res.status(200).send({
        status: 200,
        message: 'Check your email address to reset your password',
      });
    } catch (error) {
      return res.status(500).send({
        status: 500,
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
   * @returns {Object} json data
   * @memberof UserController
   */
  static async handlePasswordReset(req, res) {
    // verify token and if its not expired
    const { token } = req.params;
    const tokenDecoded = Helper.verifyToken(token);
    if (tokenDecoded === 'invalid token') {
      return res.status(400).send({
        status: 400,
        message: 'Invalid token or Token expired'
      });
    }

    // check if payload's email address exists in database
    const { email } = tokenDecoded;
    const user = await UserService.findOne(email, '');
    if (!user) {
      return res.status(400).send({
        status: 400,
        message: `User with email ${email} is not not found `
      });
    }

    // check if old password equals new password
    const checkPassword = await Helper.comparePassword(user.password, req.body.password);
    if (checkPassword) {
      return res.status(400).send({
        status: 400,
        message: 'New password cannot be the same as current password'
      });
    }

    // update password
    const newPassword = req.body.password;
    const password = await Helper.hashPassword(newPassword);
    if (!password) {
      return res.status(500).send({
        status: 500,
        message: 'An error occured, Contact your administrator'
      });
    }
    try {
      await UserService.updateUser(email, { password });

      return res.status(200).send({
        status: 200,
        message: 'Password reset successfully'
      });
    } catch (error) {
      return res.status(400).send({
        status: 400,
        message: 'Failed to fetch user'
      });
    }
  }
}

export default UserController;
