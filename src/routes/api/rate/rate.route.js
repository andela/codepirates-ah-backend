import express from 'express';
import validateToken from '../../../middlewares/auth';
import confirmEmaiAuth from '../../../middlewares/emailVarification.middleware';
import rateController from '../../../controllers/rating.controller';
import sanitizeRate from '../../../middlewares/validators/rate.validation';
import { checkQuery } from '../../../middlewares/query.check';

const router = express.Router();
router.get('/', checkQuery, rateController.getAllRating);
router.get('/:articleSlug', checkQuery, [validateToken, confirmEmaiAuth], rateController.getArticleRating);
router.put('/:articleSlug', [validateToken, sanitizeRate, confirmEmaiAuth], rateController.createOrUpdateRate);

export default router;
