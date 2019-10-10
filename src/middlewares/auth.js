import env from 'dotenv';
import jwt from 'jsonwebtoken';
import Helper from '../helpers/helper';
import UserService from '../services/user.service';

env.config();
const validateToken = async (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers.authorization;
  if (!token) {
    return res.status(401).send({
      status: 401,
      message: 'Unauthorized access'
    });
  }
  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }
  if (token) {
    // Check if token is blacklisted
    const identifier = token.match(/\d+/g).join('');
    const droppedToken = await UserService.findDroppedToken(identifier);
    const rejectedToken = droppedToken
      ? await Helper.comparePassword(droppedToken.invalidToken, token)
      : false;

    // Return user logged out message
    if (rejectedToken) {
      return res.status(401).send({
        status: 401,
        message: 'You are logged out!'
      });
    }
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
  } else {
    return res.status(400).send({
      status: 400,
      message: 'Auth token is not supplied'
    });
  }
};
export default validateToken;
