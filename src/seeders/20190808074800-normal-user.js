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
      subscribed: false,
      inAppNotification: false,
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
    {
      firstname: 'userthree',
      lastname: 'userthree',
      email: 'userthree@gmail.com',
      password: hashPassword,
      username: 'userthree',
      role: 'normal',
      verified: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      firstname: 'userfour',
      lastname: 'userfour',
      email: 'userfour@gmail.com',
      password: hashPassword,
      username: 'userfour',
      role: 'normal',
      verified: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      firstname: 'userfive',
      lastname: 'userfive',
      email: 'userfive@gmail.com',
      password: hashPassword,
      username: 'userfive',
      role: 'normal',
      verified: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      firstname: 'usersix',
      lastname: 'usersix',
      email: 'usersix@gmail.com',
      password: hashPassword,
      username: 'usersix',
      role: 'normal',
      verified: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      firstname: 'userseven',
      lastname: 'userseven',
      email: 'userseven@gmail.com',
      password: hashPassword,
      username: 'userseven',
      role: 'normal',
      verified: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
  ]),

  down: queryInterface => queryInterface.bulkDelete('users', null, {})
};
