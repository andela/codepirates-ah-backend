import Helper from '../helpers/helper';
import models from '../models/index';

const UserDB = models.user;

const confirmEmailAuth = async (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers.authorization;
  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }
  const decoded = await Helper.verifyToken(token);
  const findUser = await UserDB.findOne({ where: { email: decoded.email } });

  if (!findUser) return res.status(404).json({ status: 404, message: 'User not found' });
  if (findUser.verified === false) {
    return res
      .status(403)
      .json({ status: 403, message: 'Please confirm the verification note sent to your email address.' });
  }
  next();
};

export default confirmEmailAuth;
