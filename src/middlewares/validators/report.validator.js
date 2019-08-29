import Joi from 'joi';
import Util from '../../helpers/util';

const util = new Util();

export default (req, res, next) => {
  const { reason } = req.body;

  const schema = {
    reason: Joi.string().valid('Rules Violation', 'Spam', 'Harassment').required(),
  };
  const { error } = Joi.validate({
    reason
  }, schema);

  if (!error) return next();
  const errorMessageFromJoi = error.details[0].message;
  const removeEscapeCharacters = errorMessageFromJoi.replace(/['"]+/g, '');
  util.setError(400, removeEscapeCharacters);
  return util.send(res);
};
