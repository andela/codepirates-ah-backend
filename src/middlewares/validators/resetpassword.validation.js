import Joi from 'joi';
import Util from '../../helpers/util';

const util = new Util();

export default (req, res, next) => {
  const { password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    util.setError(400, 'Passwords provided do not match');
    return util.send(res);
  }

  const schema = {
    password: Joi.string().trim().regex(/^(?:(?=.*[a-z])(?:(?=.*[A-Z])(?=.*[\d\W])|(?=.*\W)(?=.*\d))|(?=.*\W)(?=.*[A-Z])(?=.*\d)).{8,}$/).required(),
  };
  const { error } = Joi.validate({
    password
  }, schema);

  if (!error) return next();
  const errorMessageFromJoi = error.details[0].message;

  if (errorMessageFromJoi.includes('fails to match the required pattern')) {
    util.setError(400, 'Password should be altleast 8 characters, Contain both uppercase and lower case and a combination of letters, numbers and symbols');
    return util.send(res);
  }
  if (errorMessageFromJoi === '"password" is not allowed to be empty') {
    util.setError(400, 'No password was specified');
    return util.send(res);
  }
};
