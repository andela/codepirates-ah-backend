import Joi from 'joi';

export const restrictions = () => {
  const validationOptions = {
    abortEarly: false,
    allowUnknown: true
  };
  return validationOptions;
};

export const schema = {
  articleSchema: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().required(),
    body: Joi.string().required()
  }),
};
