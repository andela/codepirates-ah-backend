import express from 'express';
import auth from '../../../middlewares/auth';
import articleController from '../../../controllers/articles.controller';
import imageUpload from '../../../middlewares/multer';
import validate from '../../../middlewares/validators/general.validation';
import { schema } from '../../../middlewares/validators/schemas';
import confirmEmailAuth from '../../../middlewares/emailVarification.middleware';
import validateId from '../../../middlewares/validators/articleId.validation';
import FavoritesController from '../../../controllers/favorited.articles.controller';
import { checkQuery } from '../../../middlewares/query.check';
import tagController from '../../../controllers/tag';
import TagWare from '../../../middlewares/tag.middleware';
import highlight from '../../../controllers/highlight.controller';
import share from '../../../middlewares/shareHighlight.middleware';

const router = express.Router();
const {
  checkArticle, checkTagName, tagLength, tagLimit
} = TagWare;
const {
  createArticleTag, getArticleTags, editArticleTag, deleteArticleTag
} = tagController;

router.post('/:articleId/favorite', [auth, confirmEmailAuth, validateId], FavoritesController.createOrRemoveFavorite);
router.post('/', [auth, confirmEmailAuth], imageUpload.array('images', 10), validate(schema.articleSchema), articleController.createArticles);
router.get('/', checkQuery, articleController.getAllArticles);
router.get('/:slug', articleController.getOneArticle);
router.delete('/:slug', [auth, confirmEmailAuth], articleController.deleteArticle);
router.patch('/:slug', [auth, confirmEmailAuth], imageUpload.array('images', 10), articleController.UpdateArticle);


// Highlight
router.post('/:slug/highlight', [auth], highlight.bodyHighlightedText);
router.delete('/highlight/:id', auth, highlight.deleteHighlightComment);
router.get('/:articleId/highlight', auth, highlight.getHighlights);
router.get('/:id/highlight/share/:channel', [auth, share], highlight.shareHightlight);

// tags

router.post('/:articleId/tags', [auth, confirmEmailAuth], checkArticle, tagLimit, tagLength, createArticleTag);
router.get('/:articleId/tags', checkArticle, getArticleTags);
router.patch('/:articleId/:name', [auth, confirmEmailAuth], checkArticle, checkTagName, editArticleTag);
router.delete('/:articleId/:name', [auth, confirmEmailAuth], checkArticle, checkTagName, deleteArticleTag);

export default router;
