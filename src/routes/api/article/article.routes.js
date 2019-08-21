import express from 'express';
import auth from '../../../middlewares/auth';
import articleController from '../../../controllers/articles.controller';
import imageUpload from '../../../middlewares/multer';
import validate from '../../../middlewares/validators/general.validation';
import { schema } from '../../../middlewares/validators/schemas';
import fakeCloud from '../../../middlewares/fakecloud';
import confirmEmailAuth from '../../../middlewares/emailVarification.middleware';

const router = express.Router();

router.post('/fake', auth, fakeCloud, validate(schema.articleSchema), articleController.createArticles);


router.post('/articles', [auth, confirmEmailAuth], imageUpload.array('images', 10), validate(schema.articleSchema), articleController.createArticles);
router.get('/articles', [auth, confirmEmailAuth], articleController.getAllArticles);
router.get('/articles/:slug', [auth, confirmEmailAuth], articleController.getOneArticle);
router.delete('articles/:slug', [auth, confirmEmailAuth], articleController.deleteArticle);
router.patch('articles/:slug', [auth, confirmEmailAuth], imageUpload.array('images', 10), articleController.UpdateArticle);
export default router;
