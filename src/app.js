import winston from 'winston';
import express from 'express';
import bodyParser from 'body-parser';
import logging from './helpers/logging';
import routes from './routes/index';
import './config/cloudinary.config';
import { mock } from './middlewares/validators/socialLogin-mock';

const app = express();
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development') {
  app.use(mock);
}
logging();
app.use(routes);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => winston.info(`Listening on port ${port}...`));

export default server;
