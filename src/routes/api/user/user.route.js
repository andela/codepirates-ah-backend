import express from 'express';
import UserController from '../../../controllers/user.controller';
import validateToken from '../../../middlewares/auth';
import admin from '../../../middlewares/admin';

const router = express.Router();

router.post('/signin', (req, res) => {
  const { firstname, lastname } = req.body;
  return res.status(200).json({ status: 200, data: { firstname, lastname } });
});
router.get('/allusers', [validateToken, admin], UserController.getAllUsers);
router.post('/signup', UserController.signup);
router.post('/login', UserController.login);
router.get('/:id', [validateToken, admin], UserController.getOneUser);
router.delete('/:id', [validateToken, admin], UserController.deleteUser);
router.put('/update/:email', [validateToken, admin], UserController.updateUser);
router.post('/signup/admin', [validateToken, admin], UserController.createAdmin);
export default router;
