import express from 'express';
import Search from '../../../controllers/search.controller';

const router = express.Router();

router.get('/', Search.processSearchQuery);

export default router;
