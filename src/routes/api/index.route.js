import express from 'express';
import swaggerui from 'swagger-ui-express';
import path from 'path';
import swaggerSpecification from '../../config/swagger';

import oauth from './oauth/oauth.routes';
import user from './user/user.route';
import article from './article/article.routes';
import profile from './profile/profile.route';
import likes from './likes/likes.routes';
import rate from './rate/rate.route';
import Comments from './comment/comments.route';
import notifications from './notifications/notification.route';
import tag from './tag/tag.routes';
import reports from './reports/reports.routes';
import search from './search/search.routes';

const router = express.Router();
router.use('/images', express.static(path.join(__dirname, 'images')));

router.use('/search', search);
router.use('/comments', Comments);
router.use(oauth);
router.use('/profile', profile);
router.use('/likes', likes);
router.use('/users', user);
router.use('/articles', article);
router.use('/rate', rate);
router.use('/notifications', notifications);
router.use('/tags', tag);
router.use('/reports', reports);

router.use('/api-docs', swaggerui.serve, swaggerui.setup(swaggerSpecification));


export default router;
