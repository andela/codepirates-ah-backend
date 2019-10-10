import env from 'dotenv';
import jwt from 'jsonwebtoken';

env.config();
const verifyIfTokenExists = async (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers.authorization;
  if (!token) {
    next();
  } else {
    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
    }
    if (token) {
      jwt.verify(token, process.env.SECRET_KEY, (err, decode) => {
        if (err) {
          return res.status(401).send({
            status: 401,
            message: 'Token is not valid'
          });
        }
        req.token = token;
        req.auth = decode;
        next();
      });
    }
  }
};
export default verifyIfTokenExists;
