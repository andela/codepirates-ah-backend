import  Helper from '../helpers/helper';


const hashedpass= Helper.hashPassword(process.env.adminpass);
export default {
  up: (queryInterface) => {
    return queryInterface.bulkInsert(
      "users",
      [
       
        {
          firstname: "admin",
          lastname: "admin",
          email: "admin@gmail.com",
          password: hashedpass,
          username:"admin",
          role: "admin",
          verified:true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },
  down: (queryInterface) => {
    return queryInterface.bulkDelete("users", null, {});
  }
 };