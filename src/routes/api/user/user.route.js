import express from 'express';
import UserController from '../../../controllers/user.controller';
import signUpValidator from '../../../middlewares/validators/signup.validation';

const router = express.Router();

const { registerUser } = UserController;

router.post('/register', signUpValidator, registerUser);

export default router;
