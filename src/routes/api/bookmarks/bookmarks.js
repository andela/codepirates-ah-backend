import BookMarkController from '../../../controllers/bookmarks.controller';
import auth from '../../../middlewares/auth';
import express from 'express';


const router = express.Router();
const { createBookMark, getUserBookMarks, getBookMarks } = BookMarkController;

router.get('/bookmarks', getBookMarks);
router.get('/bookmarks/collections', getCollections);