import User from '../services/user.service';
import Helper from '../helpers/helper';

const login = async (req, res) => {
  const data = req.user;
  const firstname = data.name.givenName;
  const lastname = data.name.middleName;
  const email = data.emails[0].value;
  const username = `${firstname}.${lastname}`;

  // check if user is in db
  const registeredUser = await User.findOne(email, '');

  // if yes generate token
  if (registeredUser) {
    const payload = {
      email,
      role: data.role,
      verified: data.verified
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
  const hasspassword = Helper.hashPassword('password');
  const dbSchema = {
    firstname, lastname, email, username, password: hasspassword
  };
  console.log(dbSchema);
  const createdUser = await User.addUser(dbSchema);
  const payload = {
    email: createdUser.email,
    role: createdUser.role,
    verified: createdUser.verified
  };
  console.log('yeyeyess', payload);
  const token = Helper.generateToken(payload);
  console.log('token', token);
  return res.status(201).json({
    status: 201,
    message: 'Successfully signed up, please verify your account from your email address',
    data: {
      firstname: createdUser.firstname,
      lastname: createdUser.lastname,
      email: createdUser.email,
      username: createdUser.username,
      role: createdUser.role,
    },
    token,
  });
};
// if user not in db create new user

//   console.log(`creating user ${user}`);
//   const createdUser = UserService.addUser(socialUser);
//   const {
//     firstname, lastname, username, email
//   } = createdUser;
//   const payload = {
//     email: socialUser.email,
//     role: socialUser.role,
//     verified: socialUser.verified
//   };
//   const token = Helper.generateToken(payload);
//   return res.status(201).json({
//     status: 201,
//     message: 'successfully created account ',
//     data: {
//       firstName, lastName, email
//     },
//     token
//   });
//   });
// };

export default login;
