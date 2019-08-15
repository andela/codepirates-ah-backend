import express from 'express';
import UserController from '../../../controllers/user.controller';
import validateToken from '../../../middlewares/auth';
import validateUser from '../../../middlewares/validators/signup.validation';
import validateUserId from '../../../middlewares/validators/userId.validation';
import admin from '../../../middlewares/admin';
import verifyEmail from '../../../controllers/verify-controller';
import confirmEmaiAuth from '../../../middlewares/emailVarification.middleware';
import followController from '../../../controllers/follow.controller';
import resetPasswordValidation from '../../../middlewares/validators/resetpassword.validation';

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
router.post('/profiles/:userId/follow', [validateToken, validateUserId], followController.follow);
router.get('/profiles/following', validateToken, followController.listOfFollowedUsers);
router.get('/profiles/followers', validateToken, followController.listOfFollowers);


// reset password route handlers
router.post('/reset', UserController.requestPasswordReset);
router.patch('/reset/:token', resetPasswordValidation, UserController.handlePasswordReset);

export default router;
