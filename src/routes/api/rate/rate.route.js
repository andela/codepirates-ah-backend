import express from 'express';
import validateToken from '../../../middlewares/auth';
import confirmEmaiAuth from '../../../middlewares/emailVarification.middleware';
import rateController from '../../../controllers/rating.controller';
import sanitizeRate from '../../../middlewares/validators/rate.validation';

const router = express.Router();

router.get('/:articleSlug', [validateToken, confirmEmaiAuth], rateController.getArticleRating);
router.post('/:articleSlug', [validateToken, sanitizeRate, confirmEmaiAuth], rateController.setArticleRating);
router.patch('/:articleSlug', [validateToken, sanitizeRate, confirmEmaiAuth], rateController.updateArticleRating);

export default router;
