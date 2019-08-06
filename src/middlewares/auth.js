import env from 'dotenv';
import jwt from 'jsonwebtoken';
env.config();
const validateToken = (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers.authorization;
    if (!token) {
        return res.status(401).send({
            status:401,
            message:'Unauthorized access'
        })
    }
    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
    }
    if (token) {
      jwt.verify(token, process.env.SECRET_KEY, (err, decode) => {
        if (err) {
            return res.status(401).send({
                status:401,
                message:'Token is not valid'
            })
        } else {
          req.auth = decode;
          next();
        }
        return decode;
        
      });
    } else {
        return res.status(400).send({
            status:400,
            message:'Auth token is not supplied'
        }) 
    }
  };
  export default validateToken;