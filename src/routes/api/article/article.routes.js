import express from 'express';
import auth from '../../../middlewares/auth';
import articleController from '../../../controllers/articles.controller';
import tagController from '../../../controllers/tag';
import imageUpload from '../../../middlewares/multer';
import validate from '../../../middlewares/validators/general.validation';
import { schema } from '../../../middlewares/validators/schemas';
import confirmEmailAuth from '../../../middlewares/emailVarification.middleware';
import TagService from '../../../middlewares/tag.middleware';

const router = express.Router();
const {
  checkArticle, checkTagName, checkTagId, tagLength, tagLimit
} = TagService;
const {
  createArticleTag, getArticleTags, editArticleTag, deleteArticleTag
} = tagController;


router.post('/articles', [auth, confirmEmailAuth], imageUpload.array('images', 10), validate(schema.articleSchema), articleController.createArticles);
router.get('/articles', [auth, confirmEmailAuth], articleController.getAllArticles);
router.get('/articles/:slug', [auth, confirmEmailAuth], articleController.getOneArticle);
router.delete('articles/:slug', [auth, confirmEmailAuth], articleController.deleteArticle);
router.patch('articles/:slug', [auth, confirmEmailAuth], imageUpload.array('images', 10), articleController.UpdateArticle);


router.post('/articles/:articleId/tags', [auth, confirmEmailAuth], checkArticle, tagLimit, tagLength, createArticleTag);
router.get('/articles/:articleId/tags', checkArticle, getArticleTags);
router.patch('/articles/:articleId/:name', [auth, confirmEmailAuth], checkArticle, checkTagName, editArticleTag);
router.delete('/articles/:articleId/:tagId', [auth, confirmEmailAuth], checkArticle, checkTagId, deleteArticleTag);

export default router;
