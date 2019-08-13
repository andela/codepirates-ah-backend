import cloudinary from 'cloudinary';
import { config } from 'dotenv';
import UserService from '../services/user.service';
import Util from '../helpers/util';

const util = new Util();
config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

/**
 * @description User profile
 */
class Profile {
  /**
         * @description get user profile
         * @param {object} req
         * @param {object} res
         * @returns {object} return object containing user profile
         */
  static async getProfile(req, res) {
    const userName = req.params.username;

    try {
      let userfound;
      if (userName) {
        userfound = UserService.findOne('', userName);
      } else {
        userfound = await UserService.findOne(req.auth.email, '');
      }
      if (!userfound.id) {
        util.setError(404, 'Profile not found');
        return util.send(res);
      }
      const data = {
        userName: userfound.userName,
        bio: userfound.bio,
        image: userfound.image,
      };
      util.setSuccess(200, 'Successfully retrieved a user profile', data);
      return util.send(res);
    } catch (err) {
      util.setError(400, 'we are facing some problemsin system, please contact administrator');
      return util.send(res);
    }
  }

  /**
         * @description update user profile
         * @param {object} req
         * @param {object} res
         * @returns {object} return object containing updated user profile
         */
  static async updateProfile(req, res) {
    console.log(req.body);
    let filename = '';
    if (req.files.image) {
      filename = req.files.image.path;
    }


    cloudinary.v2.uploader.upload(filename, { tags: 'CodepiratesAuthors-haven' }, async (err, image) => {
      try {
        const userName = req.auth.email;
        const user = await UserService.findOne(userName);
        const oldURL = user.image;
        if (!user) {
          util.setError(400, 'User not found');
          return util.send(res);
        }
        const inputUsername = req.body.userName;
        if (inputUsername) {
          const usernamefound = await UserService.findOneByUserName(inputUsername);
          if (usernamefound) {
            util.setError(409, 'Sorry! The profile username taken, try another one');
            return util.send(res);
          }
        }
        let imgURL;
        if (!err) {
          imgURL = image.secure_url;
        }
        if (!imgURL) {
          imgURL = oldURL;
        }
        const prof = {
          email: req.params.email,
          userName: inputUsername,
          bio: req.body.bio,
          image: imgURL,
        };
        const updateProfile = await UserService.updateProfile(prof);
        const newProfile = {
          userName: updateProfile.userName,
          email: updateProfile.email,
          bio: updateProfile.bio,
          image: updateProfile.image,
          upadatedAt: updateProfile.upadatedAt,
        };
        util.setSuccess(200, 'Successfully updated the profile', newProfile);
        return util.send(res);
      } catch (error) {
        util.setError(400, 'we are facing some problemsin system, please contact administrator');
        return util.send(res);
      }
    });
  }
}
export default Profile;
