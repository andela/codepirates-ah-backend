import express from 'express';
import Comments from '../../../controllers/comments.controller';
import auth from '../../../middlewares/auth';
import CommentsValidation from '../../../middlewares/validators/comments.body';
import confirmEmailAuth from '../../../middlewares/emailVarification.middleware';

const router = express.Router();
router.post('/:slug', [auth, CommentsValidation], Comments.createComment);
router.get('/:articleSlug', Comments.getAllCommentsOfArticle);
router.get('/', [auth], Comments.getComments);
router.delete('/:id', [auth], Comments.deleteComment);
router.delete('/particularArticle/:id', [auth], Comments.deleteCommentOfAnArticle);
router.put('/particularArticle/:id', [auth, CommentsValidation], Comments.updateParticularComment);
router.put('/:id', [auth, CommentsValidation], Comments.updateComment);
router.get('/like/:id', [auth, confirmEmailAuth], Comments.getLikesComments);
router.post('/like/:id', [auth, confirmEmailAuth], Comments.likeComment);
router.put('/like/:id', [auth, confirmEmailAuth], Comments.updateLikeComment);

export default router;
