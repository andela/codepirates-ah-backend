import winston from 'winston';

export default (req, res) => {
  winston.error('Resource not found');
  return res.status(404).send({ status: 404, error: 'Resource not found' });
};
