import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

import api from './api/index.route';
import error from '../middlewares/error.middleware';
import notfound from '../middlewares/404.middleware';

dotenv.config();

const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(cors());
const apiVersion = process.env.API_VERSION;

const baseUrl = `/api/${apiVersion}`;

router.get('/', (req, res) => res.status(200).json({ status: 200, data: 'Welcome to Authors Haven.' }));
router.use(baseUrl, api);

router.use(error);
router.use(notfound);

export default router;
