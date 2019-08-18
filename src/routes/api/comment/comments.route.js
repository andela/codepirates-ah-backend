import express from 'express';
import Comments from '../../../controllers/comments.controller';
import auth from '../../../middlewares/auth';
import CommentsValidation from '../../../middlewares/validators/comments.body';

const router = express.Router();
router.post('/:slug', [auth, CommentsValidation], Comments.createComment);
router.get('/', [auth], Comments.getComments);
router.delete('/:id', [auth], Comments.deleteComment);
router.put('/:id', [auth, CommentsValidation], Comments.updateComment);
export default router;
