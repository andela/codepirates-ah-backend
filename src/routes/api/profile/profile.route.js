import express from 'express';
import connectmultiparty from 'connect-multiparty';
import ProfileController from '../../../controllers/profile.controller';
import validateToken from '../../../middlewares/auth';
import profileVAlidator from '../../../middlewares/validators/user.profile.validator';
import confirmEmaiAuth from '../../../middlewares/emailVarification.middleware';


const connectMulti = connectmultiparty();
const router = express.Router();
// greate edit a viewing profile handlers

router.get('/', validateToken, confirmEmaiAuth, ProfileController.getProfile);
router.get('/:username', validateToken, confirmEmaiAuth, ProfileController.getProfile);
router.put('/', [validateToken, confirmEmaiAuth, connectMulti, profileVAlidator], ProfileController.updateProfile);


export default router;
