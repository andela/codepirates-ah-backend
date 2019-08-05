import express from 'express';
import UserController from '../../../controllers/user.controller';
import validateToken from '../../../middlewares/auth';
const router = express.Router();

router.post('/signin', (req, res) => {
  const { firstname, lastname } = req.body;
  return res.status(200).json({ status: 200, data: { firstname, lastname } });
});
router.get('/allusers',[validateToken],UserController.getAllUsers);
router.post('/login',UserController.login);
router.post('/new',UserController.signup);
router.post('/login',UserController.login);
router.get('/oneuser/:id',UserController.getOneUser);
router.delete('/oneuser/:id',UserController.deleteUser);
router.put('/update/:email',UserController.updateUser);
export default router;
