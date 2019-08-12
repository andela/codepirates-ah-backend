import express from 'express';
import swaggerui from 'swagger-ui-express';
import swaggerSpecification from '../../config/swagger';


import oauth from './oauth/oauth.routes';
import user from './user/user.route';

const router = express.Router();

// router.use('/login', oauth);
router.use(oauth);
router.use('/users', user);
router.use('/api-docs', swaggerui.serve, swaggerui.setup(swaggerSpecification));

export default router;
