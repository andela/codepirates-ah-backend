import database from '../models/index';
import { Op } from 'sequelize'

class UserService {
  static async findOne(email, username) {
    try {
      return await database.user.findOne({
        where: { [Op.or]: [{ email }, {username: username}]}
      });
    } catch (error) {
      throw error;
    }
  }
 static async getAllUsers() {
   try {
     return await database.user.findAll();
   } catch (error) {
     throw error;
   }
 }
 static async addUser(newUser) {
   try {
     return await database.user.create(newUser);
   } catch (error) {
     throw error;
   }
 }
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
 static async updateUser(email, updateUser) {
  try {
    const userToUpdate = await database.user.findOne({
      where: { email: email }
    });

    if (userToUpdate) {
      await database.user.update(updateUser, { where: { email: email } });

      return updateBook;
    }
    return null;
  } catch (error) {
    throw error;
  }
}
}
export default UserService;