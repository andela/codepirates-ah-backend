import express from 'express';
import UserController from '../../../controllers/user.controller';
import validateToken from '../../../middlewares/auth';
import validateUser from '../../../middlewares/validators/signup.validation';
import admin from '../../../middlewares/admin';
import verifyEmail from '../../../controllers/verify-controller';
import confirmEmaiAuth from '../../../middlewares/emailVarification.middleware';
import follow from '../../../controllers/follow.controller';

const router = express.Router();
router.get('/verify', verifyEmail);
router.get('/allusers', [validateToken, admin, confirmEmaiAuth], UserController.getAllUsers);
router.post('/signup', validateUser, UserController.signup);
router.post('/login', UserController.login);
router.get('/:id', [validateToken, confirmEmaiAuth], UserController.getOneUser);
router.delete('/:id', [validateToken, confirmEmaiAuth], UserController.deleteUser);
router.put('/update/:email', [validateToken, confirmEmaiAuth], UserController.updateUser);
router.post('/signup/admin', [validateToken, admin, confirmEmaiAuth], UserController.createAdmin);
router.post('/signout', validateToken, UserController.signoutUser);
router.post('/profiles/:email/follow', validateToken, follow);

export default router;
