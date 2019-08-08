import dotenv from 'dotenv';

dotenv.config();

export const callbackFunc = (accessToken, refreshToken, profile, done) => done(null, profile);

export const facebookConfig = {
  clientID: process.env.FACEBOOK_ID,
  clientSecret: process.env.FACEBOOK_SECRET,
  callbackURL: process.env.FACEBOOK_CALLBACK_URL,
  profileFields: ['id', 'name', 'email', 'photos']
};

export const twitterConfig = {
  consumerKey: process.env.TWITTER_ID,
  consumerSecret: process.env.TWITTER_SECRET,
  callbackURL: process.env.TWITTER_CALLBACK_URL,
  profileFields: ['id', 'name', 'email', 'photos']
};

export const googleConfig = {
  clientID: process.env.GOOGLE_ID,
  clientSecret: process.env.GOOGLE_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
};
