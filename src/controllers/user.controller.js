import UserService from '../services/user.service';
import Helper from '../helpers/helper';
import sendEmail from '../helpers/verification-email';

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
        email: theUser.email,
        role: theUser.role
      };
      const token = await Helper.generateToken(payload);
      return res.status(200).send({
        status: 200,
        message: `welcome  back ${theUser.firstname}`,
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
        email: createdUser.email,
        role: createdUser.role,
        verified: createdUser.verified
      };
      const token = await Helper.generateToken(payload);
      const verifyUrl = `${process.env.BACKEND_URL}/api/${
        process.env.API_VERSION
      }/users/verify?token=${token}`;
      sendEmail(payload.email, newUser.username, verifyUrl);
      return res.status(201).json({
        status: 201,
        message:
          'Your account has been successfully created. An email has been sent to you with detailed instructions on how to activate it.',
        data: { firstname, lastname, email },
        token
      });
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
}

export default UserController;
