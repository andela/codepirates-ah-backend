import express from 'express';
import swaggerui from 'swagger-ui-express';
import swaggerSpecification from '../../config/swagger';


import oauth from './oauth/oauth.routes';
import user from './user/user.route';
import article from './article/article.routes';

const router = express.Router();

router.use(oauth);
router.use('/users', user);
router.use('/', article);
router.use('/api-docs', swaggerui.serve, swaggerui.setup(swaggerSpecification));

export default router;
