import User from '../services/user.service';
import Helper from '../helpers/helper';
import verifyUser from '../helpers/verification-email';

const login = async (req, res) => {
  const data = req.user;
  const firstname = data.name.givenName;
  const lastname = data.name.middleName || data.name.familyName;
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
    message: 'Your account has been successfully created. An email has been sent to you with detailed instructions on how to activate it.',
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

export default login;
