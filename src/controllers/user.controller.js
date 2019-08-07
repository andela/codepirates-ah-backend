/* eslint-disable indent */
/* eslint-disable require-jsdoc */
import Util from '../helpers/util';
import helper from '../helpers/helper';
import db from '../models';

const util = new Util();
const { User } = db;

class UserController {
    static async registerUser(req, res) {
        const {
            firstname, lastname, email, password
        } = req.body;
        try {
            const existingUser = await helper.findRecord(User, {
                email
            });
            if (existingUser) {
                return util.setError(409, 'Email is already in use');
            }

            User.create({
                firstname,
                lastname,
                email,
                password
            })
                .then(newUser => util.setSuccess(
                    201,
                    'User created Successfully',
                    newUser
                ))
                .catch(() => util.setError(500, 'Internal server error'));
        } catch (error) {
            util.setError(400, error.message);
            return util.send(res);
        }
    }
}


export default UserController;
