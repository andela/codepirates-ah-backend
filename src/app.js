import winston from 'winston';
import express from 'express';
import bodyParser from 'body-parser';
// import passport from 'passport';
import cors from 'cors';
import session from 'express-session';
// import passportTwitter from './middlewares/Passport';
import logging from './helpers/logging';
import routes from './routes/index';


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
// app.use(session({
//   secret: process.env.SECRET_KEY,
//   resave: true,
//   saveUninitialized: true,
//   cookie: {
//     maxAge: 3600000
//   }
// }));
// app.use(passport.initialize());
// app.use(passport.session());
// passportTwitter(passport);
logging();
app.use(routes);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => winston.info(`Listening on port ${port}...`));

export default server;
