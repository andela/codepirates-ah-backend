import Helper from '../helpers/helper';
import models from '../models/index';
import Util from '../helpers/util';

const util = new Util();

const User = models.user;

const verifyEmail = async (req, res) => {
  const { token } = req.query;
  try {
    const decoded = await Helper.verifyToken(token);
    const findUser = await User.findOne({ where: { email: decoded.email } });
    if (!findUser) return res.status(404).json({ status: 404, message: 'The user does not exists' });
    await User.update({ verified: true }, { where: { email: decoded.email } });
    util.setSuccess(200, 'You have been verified.', { email: decoded.email });
    return util.send(res);
  } catch (error) {
    util.setError(400, 'invalid request');
    return util.send(res);
  }
};

export default verifyEmail;
