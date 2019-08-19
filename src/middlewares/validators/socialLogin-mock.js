import dotenv from 'dotenv';
import fakeUsers from '../../mock-data';

dotenv.config();

export const mock = (req, res, next) => {
  if (req.url.includes('login/') && req.method === 'GET') {
    res.redirect(`/auth/fake?provider=${req.url.split('/')[2]}`);
  } else {
    next();
  }
};

export const fakeAuth = (req, res, next) => {
  req.user = fakeUsers[process.env[req.query.provider]] || fakeUsers.google_new;
  next();
};
