import Joi from 'joi';
import Util from '../../helpers/util';

const util = new Util();

export default (req, res, next) => {
  const { userId } = req.params;

  const schema = {
    userId: Joi.number().positive().required()
  };
  const { error } = Joi.validate({
    userId
  }, schema);

  if (!error) return next();
  const errorMessageFromJoi = error.details[0].message;
  switch (errorMessageFromJoi) {
    case '"userId" must be a number':
      util.setError(400, 'userId must be a non negative integer');
      return util.send(res);
    default:
      util.setError(400, errorMessageFromJoi);
      return util.send(res);
  }
};
