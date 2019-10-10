import Joi from 'joi';
import Util from '../../helpers/util';

const util = new Util();

export default (req, res, next) => {
  const {
    username, bio
  } = req.body;

  const schema = {
    username: Joi.string()
      .trim()
      .regex(/^[a-zA-Z]+$/)
      .min(3)
      .max(20),
    bio: Joi.string()
      .trim()
      .min(0)
      .max(200)
      .allow('')
      .allow(null),
  };
  const { error } = Joi.validate({
    bio, username
  }, schema);

  if (!error) return next();
  const errorMessageFromJoi = error.details[0].message;
  switch (errorMessageFromJoi) {
    case `"bio" with value "${String(bio)}" fails to match the required pattern: /^[a-zA-Z]+$/`:
      util.setError(400, 'bio should contain only characters');
      return util.send(res);
    case `"username" with value "${String(username)}" fails to match the required pattern: /^[a-zA-Z]+$/`:
      util.setError(400, 'username should contain only characters');
      return util.send(res);
    default:
      util.setError(400, errorMessageFromJoi);
      return util.send(res);
  }
};
