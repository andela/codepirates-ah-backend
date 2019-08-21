import 'dotenv/config';
import Helper from '../helpers/helper';

const hashPassword = Helper.hashPassword(process.env.USER_PASSWORD);

export default {
  up: queryInterface => queryInterface.bulkInsert('users', [
    {
      firstname: 'user',
      lastname: 'user',
      email: 'user@gmail.com',
      password: hashPassword,
      username: 'username',
      role: 'normal',
      verified: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      firstname: 'usertwo',
      lastname: 'usertwo',
      email: 'usertwo@gmail.com',
      password: hashPassword,
      username: 'usertwo',
      role: 'normal',
      verified: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
  ]),

  down: queryInterface => queryInterface.bulkDelete('users', null, {})
};
