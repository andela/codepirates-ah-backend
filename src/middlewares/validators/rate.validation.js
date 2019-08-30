import Joi from 'joi';
import Util from '../../helpers/util';

const util = new Util();

export default (req, res, next) => {
  const { rate } = req.body;

  const schema = {
    rate: Joi.number().integer().min(1).max(5)
      .required(),
  };
  const { error } = Joi.validate({
    rate
  }, schema);

  if (!error) return next();
  const errorMessageFromJoi = error.details[0].message;
  const removeEscapeCharacters = errorMessageFromJoi.replace(/['"]+/g, '');
  util.setError(400, removeEscapeCharacters);
  return util.send(res);
};
