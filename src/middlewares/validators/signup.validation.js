import Joi from 'joi';
import isAlphaNumeric from './is.alphanumeric';
import Util from '../../helpers/util';

const util = new Util();

export default (req, res, next) => {
  const {
    firstname, lastname, email, password, username
  } = req.body;

  if (password && !isAlphaNumeric(password)) {
    util.setError(400, 'Password should be Alphanumeric');
    return util.send(res);
  }

  const schema = {
    firstname: Joi.string()
      .trim()
      .regex(/^[a-zA-Z]+$/)
      .min(1)
      .max(20)
      .required(),
    lastname: Joi.string()
      .trim()
      .regex(/^[a-zA-Z]+$/)
      .min(1)
      .max(20)
      .required(),
    username: Joi.string()
      .trim()
      .min(1)
      .max(20)
      .required(),
    password: Joi.string()
      .alphanum()
      .min(8)
      .required(),
    email: Joi.string()
      .email({ minDomainAtoms: 2 })
      .required()
  };
  const { error } = Joi.validate({
    firstname, lastname, password, email, username
  }, schema);

  if (!error) return next();
  const errorMessageFromJoi = error.details[0].message;
  switch (errorMessageFromJoi) {
    case '"password" is not allowed to be empty':
      util.setError(400, 'No password was specified');
      return util.send(res);
    case '"password" is required':
      util.setError(400, 'No password was specified');
      return util.send(res);
    case '"password" length must be at least 8 characters long':
      util.setError(400, 'Password length must be at least 8 characters long');
      return util.send(res);
    case '"email" is not allowed to be empty':
      util.setError(400, 'No email was specified');
      return util.send(res);
    case '"email" must be a valid email':
      util.setError(400, 'Email is not valid');
      return util.send(res);
    case '"email" is required':
      util.setError(400, 'No email was specified');
      return util.send(res);
    case '"firstname" is not allowed to be empty':
      util.setError(400, 'No firstname was specified');
      return util.send(res);
    case '"firstname" is required':
      util.setError(400, 'No firstname was specified');
      return util.send(res);
    case `"firstname" with value "${String(firstname)}" fails to match the required pattern: /^[a-zA-Z]+$/`:
      util.setError(400, 'firstname should contain only characters');
      return util.send(res);
    case '"lastname" is not allowed to be empty':
      util.setError(400, 'No lastname was specified');
      return util.send(res);
    case '"lastname" is required':
      util.setError(400, 'No lastname was specified');
      return util.send(res);
    case `"lastname" with value "${String(lastname)}" fails to match the required pattern: /^[a-zA-Z]+$/`:
      util.setError(400, 'lastname should contain only characters');
      return util.send(res);
    case '"username" is not allowed to be empty':
      util.setError(400, 'No username was specified');
      return util.send(res);
    case '"username" is required':
      util.setError(400, 'No username was specified');
      return util.send(res);
    default:
      util.setError(400, errorMessageFromJoi);
      return util.send(res);
  }
};
