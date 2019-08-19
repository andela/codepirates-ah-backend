import express from 'express';
import LikesController from '../../../controllers/likes.controller';
import validateToken from '../../../middlewares/auth';
import confirmEmaiAuth from '../../../middlewares/emailVarification.middleware';
import isLike from '../../../middlewares/likes.middleware';

const router = express.Router();
// greate edit a viewing profile handlers

router.get('/claps/:Article', [validateToken, confirmEmaiAuth, isLike], LikesController.getClaps);
router.get('/dislikes/:Article', [validateToken, confirmEmaiAuth, isLike], LikesController.getDislikes);
router.put('/clap/:Article', [validateToken, confirmEmaiAuth, isLike], LikesController.clap);
router.put('/dislike/:Article', [validateToken, confirmEmaiAuth, isLike], LikesController.dislike);
router.put('/unlike/:Article', [validateToken, confirmEmaiAuth, isLike], LikesController.unlike);


export default router;
