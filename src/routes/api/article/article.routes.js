import express from 'express';
import auth from '../../../middlewares/auth';
import articleController from '../../../controllers/articles.controller';
import imageUpload from '../../../middlewares/multer';
import validate from '../../../middlewares/validators/general.validation';
import { schema } from '../../../middlewares/validators/schemas';

const router = express.Router();

router.post('/articles', auth, imageUpload.array('images', 10), validate(schema.articleSchema), articleController.createArticles);
router.get('/articles', auth, articleController.getAllArticles);
router.get('/articles/:slug', auth, articleController.getOneArticle);
router.delete('/articles/:slug', auth, articleController.deleteArticle);
router.patch('/articles/:slug', auth, imageUpload.array('images', 10), articleController.UpdateArticle);
export default router;
