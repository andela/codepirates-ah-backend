import env from 'dotenv';
import jwt from 'jsonwebtoken';
import Util from '../helpers/util';


const util = new Util();
env.config();

const validateToken = (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers.authorization;
  if (!token) {
    util.setError(401, 'Unauthorized access');
    return util.send(res);
  }
  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }

  if (token) {
    jwt.verify(token, process.env.SECRET_KEY, (err, decode) => {
      if (err) {
        util.setError(401, 'Token is not valid');
      } else {
        req.auth = decode;
        next();
      }
      return util.send(res);
    });
  } else {
    util.setSuccess(400, 'Auth token is not supplied');
    return util.send(res);
  }
};
export default validateToken;
