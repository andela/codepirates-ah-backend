import express from 'express';
import socialLogin from '../../controllers/socialLogin';
import passport from '../../helpers/passport';

const router = express.Router();

<<<<<<< HEAD
=======
router.get('/',
  (req, res) => {
    res.render('home', { user: req.user });
  });

router.get('/login',
  (req, res) => {
    res.render('login');
  });

// router.get('/login/facebook',
//   passport.authenticate('facebook'));

// router.get('/return',
//   passport.authenticate('facebook', { failureRedirect: '/login' }),
//   function(req, res) {
//     res.json({user: req.user.displayName});
//   });

// router.get('/profile',
//   // require('connect-ensure-login').ensureLoggedIn(),
//   function(req, res){
//     res.json({ user: req.user });
//   });
// router.get('/', (req, res) => res.json({name: 'mike'}));
>>>>>>> feature(social login): user has to login with social platforms [Finishes #167313401]
router.get('/login/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/login/facebook/callback', passport.authenticate('facebook', { session: false }), socialLogin);


router.get('/login/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/login/google/callback', passport.authenticate('google', { session: false }), socialLogin);

<<<<<<< HEAD
=======
// router.post('/forgotpassword', resetemail, forgotPassword);
// router.patch('/resetpassword/:token', resetforgotPassword, resetPassword);

>>>>>>> feature(social login): user has to login with social platforms [Finishes #167313401]
export default router;
