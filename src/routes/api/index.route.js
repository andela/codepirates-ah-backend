import express from 'express';
import swaggerui from 'swagger-ui-express';
import swaggerSpecification from '../../config/swagger';


import user from './user/user.route';

const router = express.Router();

router.use('/users', user);
router.use('/api-docs', swaggerui.serve, swaggerui.setup(swaggerSpecification));

export default router;
