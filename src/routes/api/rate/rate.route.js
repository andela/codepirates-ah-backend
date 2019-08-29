import express from 'express';
import validateToken from '../../../middlewares/auth';
import confirmEmaiAuth from '../../../middlewares/emailVarification.middleware';
import rateController from '../../../controllers/rating.controller';
import sanitizeRate from '../../../middlewares/validators/rate.validation';
import { checkQuery } from '../../../middlewares/query.check';
import rateMiddleware from '../../../middlewares/rate.middleware';
import admin from '../../../middlewares/admin';

const router = express.Router();
router.get('/', [validateToken, confirmEmaiAuth, checkQuery, admin], rateController.getAllRating);
router.get('/:articleSlug', checkQuery, [validateToken, confirmEmaiAuth], rateController.getArticleRating);
router.put('/:articleSlug', [validateToken, sanitizeRate, confirmEmaiAuth, rateMiddleware], rateController.createOrUpdateRate);

export default router;
