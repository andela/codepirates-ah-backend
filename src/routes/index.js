import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import api from './api/index.route';
import error from '../middlewares/error.middleware';
import notfound from '../middlewares/404.middleware';

const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(cors());

router.get('/', (req, res) => res.status(200).json({ status: 200, data: 'Welcome to Authors Haven.' }));
router.use('/api/v1', api);

router.use(notfound);
router.use(error);

export default router;
