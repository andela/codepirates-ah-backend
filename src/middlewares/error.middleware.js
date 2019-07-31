import winston from 'winston';

export default (err, req, res) => {
  winston.error(err.message, err);
  res.status(500).send({ status: 500, error: 'Something failed.' });
};
