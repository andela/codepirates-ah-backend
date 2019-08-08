import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';
import { Strategy as TwitterStrategy } from 'passport-twitter';

import {
  facebookConfig, googleConfig, twitterConfig, callbackFunc
} from '../config/oauth';

passport.use(new FacebookStrategy(facebookConfig, callbackFunc));

passport.use(new GoogleStrategy(googleConfig, callbackFunc));

passport.use(new TwitterStrategy(twitterConfig, callbackFunc));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

export default passport;
