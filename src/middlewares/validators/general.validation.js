/* eslint-disable no-useless-escape */
/* eslint-disable no-shadow */
import Joi from 'joi';
import { restrictions } from './schemas';

const validate = (schema, object) => (req, res, next) => {
  const { error } = Joi.validate(object || req.body, schema, restrictions());
  if (error) {
    const err = [];
    error.details.map(error => err.push({ message: error.message.replace(/\"/g, '') }));
    return res.status(400).json({ status: 400, err });
  }
  next();
};

export default validate;
