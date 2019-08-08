import Helper from '../helpers/helper';
import models from '../models/index';

const User = models.user;

const verifyEmail = async (req, res) => {
  const { token } = req.query;
  try {
    const decoded = await Helper.verifyToken(token);
    const findUser = await User.findOne({ where: { email: decoded.email } });
    if (!findUser) return res.status(404).json({ status: 404, message: 'The user does not exists' });
    await User.update({ verified: true }, { where: { email: decoded.email } });
    return res.status(200).json({ status: 200, message: 'You have been verified.' });
  } catch (error) {
    return res.status(400).json({ status: 400, message: 'invalid request' });
  }
};

export default verifyEmail;
