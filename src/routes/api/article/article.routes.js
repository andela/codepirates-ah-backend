import express from 'express';
import auth from '../../../middlewares/auth';
import articleController from '../../../controllers/articles.controller';
import imageUpload from '../../../middlewares/multer';
import validate from '../../../middlewares/validators/general.validation';
import { schema } from '../../../middlewares/validators/schemas';
import confirmEmailAuth from '../../../middlewares/emailVarification.middleware';
import validateId from '../../../middlewares/validators/articleId.validation';
import FavoritesController from '../../../controllers/favorited.articles.controller';

const router = express.Router();

router.post('/:articleId/favorite', [auth, validateId], FavoritesController.createOrRemoveFavorite);
router.post('/', [auth, confirmEmailAuth], imageUpload.array('images', 10), validate(schema.articleSchema), articleController.createArticles);
router.get('/', articleController.getAllArticles);
router.get('/:slug', articleController.getOneArticle);
router.delete('/:slug', [auth, confirmEmailAuth], articleController.deleteArticle);
router.patch('/:slug', [auth, confirmEmailAuth], imageUpload.array('images', 10), articleController.UpdateArticle);
export default router;
