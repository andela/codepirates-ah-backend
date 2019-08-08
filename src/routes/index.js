import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
<<<<<<< HEAD
<<<<<<< HEAD
import passport from 'passport';

=======
>>>>>>> #167313390 deploy base application to heroku  (#8)
=======

>>>>>>> #167313399 User should be able to sign out (#12)
import api from './api/index.route';
import oauth from './api/oauth/oauth.routes';
import error from '../middlewares/error.middleware';
import notfound from '../middlewares/404.middleware';
import { mock } from '../middlewares/validators/socialLogin-mock';

dotenv.config();

dotenv.config();

const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(cors());
router.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: true,
    cookie: {
      maxAge: 3600000
    },
    saveUninitialized: true
  })
);
if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
  router.use(mock);
}
router.use(passport.initialize());
const apiVersion = process.env.API_VERSION;

const baseUrl = `/api/${apiVersion}`;

router.get('/', (req, res) => res.status(200).json({ status: 200, data: 'Welcome to Authors Haven.' }));
router.use(baseUrl, api);
router.use(oauth);

router.use(notfound);
router.use(error);

export default router;
