import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
<<<<<<< HEAD
import api from './api/index.route';
=======
import api from './api';
>>>>>>> chore(heroku) add index.js to test
import error from '../middlewares/error.middleware';
import notfound from '../middlewares/404.middleware';

const router = express.Router();

<<<<<<< HEAD
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(cors());

router.get('/', (req, res) => res.status(200).json({ status: 200, data: 'Welcome to Authors Haven.' }));
router.use('/api/v1', api);
=======
router.use(bodyParser.urlencoded({ extended: false }));
router.use(cors());

router.get('/', (req, res) => {
  return res.status(200).json(`Welcome to Authors Haven. you are in ${process.env.STATE} environment`);
});
router.use("/api/v1", api);
>>>>>>> chore(heroku) add index.js to test

router.use(notfound);
router.use(error);

<<<<<<< HEAD
export default router;
=======
export default router;
>>>>>>> chore(heroku) add index.js to test
