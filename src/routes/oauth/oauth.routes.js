import express from 'express';
import socialLogin from '../../controllers/socialLogin';
import passport from '../../helpers/passport';

const router = express.Router();

router.get('/login/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/login/facebook/callback', passport.authenticate('facebook', { session: false }), socialLogin);


router.get('/login/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/login/google/callback', passport.authenticate('google', { session: false }), socialLogin);

export default router;
