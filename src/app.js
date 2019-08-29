import winston from 'winston';
import express from 'express';
import logging from './helpers/logging';
import routes from './routes/index';
import './config/cloudinary.config';
import { mock } from './middlewares/validators/socialLogin-mock';

const app = express();

if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development') {
  app.use(mock);
}
logging();
app.use(routes);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => winston.info(`Listening on port ${port}...`));

export default server;
