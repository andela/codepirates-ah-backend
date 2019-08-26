import env from 'dotenv';
import jwt from 'jsonwebtoken';
import TagService from '../services/data.service';

const { checkItem } = TagService;

env.config();
const getParams = async (req, res) => {
  let userId;
  let token = req.headers['x-access-token'] || req.headers.authorization;
  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }
  jwt.verify(token, process.env.SECRET_KEY, (err, decode) => {
    if (err) {
      return res.status(401).send({
        status: 401,
        message: 'Token is not valid'
      });
    }
    userId = decode.id;
  });
  return { userId };
};
export default getParams;
