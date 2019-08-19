import { Op } from 'sequelize';
import database from '../models/index';

/**
 *
 *
 * @class UserService
 */
class UserService {
  /**
   *
   *
   * @static
   * @param {*} email
   * @param {*} username
   * @returns
   * @memberof UserService
   * @returns {Object} return db result object
   */
  static async findOne(email, username) {
    try {
      return await database.user.findOne({
        where: { [Op.or]: [{ email }, { username }] }
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   *
   * @static
   * @param {*} invalidToken
   * @returns {Object} return db result object
   * @memberof UserService
   */
  static async createDroppedToken(invalidToken) {
    try {
      return await database.DroppedToken.create(invalidToken);
    } catch (error) {
      throw error;
    }
  }

  /**
     *
     *
     * @static
     * @param {*} id
     * @returns {Object} database object
     * @memberof UserService
     */
  static async findDroppedToken(id) {
    try {
      return await database.DroppedToken.findOne({
        where: { identifier: id }
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   *
   * @static
   * @returns
   * @memberof UserService
   * @returns {Object} return db result object
   */
  static async getAllUsers() {
    try {
      return await database.user.findAll();
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   *
   * @static
   * @param {*} newUser
   * @returns
   * @memberof UserService
   * @returns {Object} return db result object
   */
  static async addUser(newUser) {
    try {
      return await database.user.create(newUser);
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   *
   * @static
   * @param {*} id
   * @returns
   * @memberof UserService
   * @returns {Object} return db result object
   */
  static async getOneUser(id) {
    try {
      const theUser = await database.user.findOne({
        where: { id: Number(id) }
      });
      return theUser;
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   *
   * @static
   * @param {*} userName
   * @param {*} email
   * @returns
   * @memberof UserService
   * @returns {Object} return db result object
   */
  static async getUserByUserName(userName, email) {
    try {
      const theUser = await database.user.findOne({
        where: {
          username: String(userName),
          email: {
            [Op.ne]: String(email)
          }
        }
      });
      return theUser;
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   *
   * @static
   * @param {*} id
   * @returns
   * @memberof UserService
   * @returns {Object} return db result object
   */
  static async deleteUser(id) {
    try {
      const UserToDelete = await database.user.findOne({ where: { id: Number(id) } });
      if (UserToDelete) {
        const deletedUser = await database.user.destroy({
          where: { id: Number(id) }
        });
        return deletedUser;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   *
   * @static
   * @param {*} email
   * @param {*} updateUser
   * @returns
   * @memberof UserService
   * @returns {Object} return db result object
   */
  static async updateUser(email, updateUser) {
    try {
      const userToUpdate = await database.user.findOne({
        where: { email }
      });

      if (userToUpdate) {
        await database.user.update(updateUser, { where: { email } });

        return updateUser;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   *
   * @static
   * @param {*} profile
   * @returns {Object} return db result object
   * @memberof UserService
   */
  static async updateProfile(profile) {
    try {
      const { email } = profile;
      return await database.user.update(
        {
          username: profile.username,
          bio: profile.bio,
          image: profile.image
        },
        { where: { email }, returning: true, plain: true }
      );
    } catch (error) {
      throw error;
    }
  }
}

export default UserService;
