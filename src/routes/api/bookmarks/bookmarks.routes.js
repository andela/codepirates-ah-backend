import express from 'express';
import BookMarkController from '../../../controllers/bookmarks.controller';
import auth from '../../../middlewares/auth';

const router = express.Router();

const { createBookMark, getUserBookMarks, editBookMark } = BookMarkController;

router.post('/users/bookmarks/:articleId', auth, createBookMark);
router.get('/users/bookmarks', auth, getUserBookMarks);
