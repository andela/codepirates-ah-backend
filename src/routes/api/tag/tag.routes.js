import express from 'express';
import TagController from '../../../controllers/tag';
import auth from '../../../middlewares/auth';
import confirmEmailAuth from '../../../middlewares/emailVarification.middleware';
import TagService from '../../../middlewares/tag.middleware';


const router = express.Router();
const { checkTagName } = TagService;
const {
  createTag, getTag, getTags, getTagArticles, editTag, deleteTagArticles
} = TagController;

router.post('/', [auth, confirmEmailAuth], createTag);
router.get('/', getTags);
router.get('/:name', checkTagName, getTag);
router.patch('/:name', [auth, confirmEmailAuth], checkTagName, editTag);
router.get('/:name/articles', checkTagName, getTagArticles);
router.delete('/:name/articles', [auth, confirmEmailAuth], checkTagName, deleteTagArticles);

export default router;
