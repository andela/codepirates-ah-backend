import  bcrypt from'bcrypt';
import jwt from 'jsonwebtoken';
import env from 'dotenv'; 
 env.config()
class Helper  {
  /**
   * Hash Password Method
   * @param {string} password
   * @returns {string} returns hashed password
   */
  static hashPassword(password) {  
    return bcrypt.hashSync(password,10);
  }
  /**
   * comparePassword
   * @param {string} hashPassword 
   * @param {string} password 
   * @returns {Boolean} return True or False
   */
  static comparePassword(hashPassword, password) {
    
    return bcrypt.compareSync(password, hashPassword);
  }
   /**
   * Gnerate Token
   * @param {string} id
   * @returns {string} token
   */
 static generateToken(payload) {
    const token = jwt.sign(payload,
      process.env.SECRET_KEY)
    return token;
  }
  /**
   * verifyToken
   * @param {string} token
   * @returns {Boolean} return True or False
   */
 static verifyToken(token) {
   try{
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    return  decode;
   }catch {
    return  false;
   }
    
  }
}
export default  Helper;