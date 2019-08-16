import dotenv from 'dotenv';
import fakeUsers from '../../mock-data';

dotenv.config();

export const mock = (req, res, next) => {
  if (req.url.includes('login/')) {
    res.redirect(`/auth/fake?provider=${req.url.split('/')[2]}`);
  } else if (req.url.includes('articles') && req.method === 'POST') {
    res.redirect(307, '/fake');
  } else {
    next();
  }
};

export const fakeAuth = (req, res, next) => {
  req.user = fakeUsers[process.env[req.query.provider]] || fakeUsers.google_new;
  next();
};
