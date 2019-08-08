import express from 'express';
import UserController from '../../../controllers/user.controller';
import validateToken from '../../../middlewares/auth';
import validateUser from '../../../middlewares/validators/signup.validation';
import admin from '../../../middlewares/admin';

const router = express.Router();
router.get('/allusers', [validateToken, admin], UserController.getAllUsers);
router.post('/signup', validateUser, UserController.signup);
router.post('/login', UserController.login);
router.get('/:id', [validateToken, admin], UserController.getOneUser);
router.delete('/:id', [validateToken, admin], UserController.deleteUser);
router.put('/update/:email', [validateToken, admin], UserController.updateUser);
router.post('/signup/admin', [validateToken, admin], UserController.createAdmin);
router.post('/signout', validateToken, UserController.signoutUser);

export default router;
