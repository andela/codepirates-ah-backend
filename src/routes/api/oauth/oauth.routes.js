import express from 'express';
import Social from '../../../controllers/social';
import passport from '../../../middlewares/passport';
import { fakeAuth } from '../../../middlewares/validators/socialLogin-mock';

const router = express.Router();

// test route
router.get('/auth/fake', fakeAuth, Social.login);

router.get('/login/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/login/facebook/callback', passport.authenticate('facebook', { session: false }), Social.login);


router.get('/login/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/login/google/callback', passport.authenticate('google', { session: false }), Social.login);

router.get('/login/twitter', passport.authenticate('twitter', { scope: ['email', 'profile'] }));
router.get('/login/twitter/callback',
  passport.authenticate('twitter', { session: false, failureRedirect: '/login' }),
  Social.login);

export default router;
