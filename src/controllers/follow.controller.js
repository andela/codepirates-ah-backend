import models from '../models/index';
import newFollowerTemplate from '../services/follower.service';
import sendEmail from '../services/email';
import followhelper from '../helpers/follow.helper';
import Util from '../helpers/util';

const util = new Util();

/**
 * @description Contains all follow and unfollow functionalities
 * @export
 * @class FollowController
 */
class FollowController {
  /**
 *
 * @description Method to follow and unfollow user
 * @static
 * @param {object} req client request
 * @param {object} res server response
 * @returns {Object} server response object
 * @memberof FollowController
 */
  static async follow(req, res) {
    try {
      const helperResult = await followhelper(req, res);
      const { followedUser, followerUser } = helperResult;

      await models.Follow.findOrCreate({
        where: { followerId: followerUser.id, followedUserId: followedUser.id },
        attributes: ['id', 'followerId', 'followedUserId']
      }).spread(async (follow, created) => {
        if (created) {
          const location = `${process.env.BACKEND_URL}/api/${process.env.API_VERSION}`;
          const url = `${location}/profiles/${followerUser.username}`;
          const emailTemplate = newFollowerTemplate(followerUser.username, url);
          const message = `Hi ${followedUser.username}, ${followerUser.username} started following you on Authors Haven`;
          await sendEmail(followedUser.email, `${message}`, emailTemplate);
          util.setSuccess(200, `You are now following ${followedUser.username}`, { followedUserId: followedUser.id });
          return util.send(res);
        }

        await follow.destroy();
        const message = `You have unfollowed ${followedUser.username}`;
        util.setSuccess(200, message, null);
        return util.send(res);
      });
    } catch (error) {
      util.setError(400, error.message);
      return util.send(res);
    }
  }

  /**
 *
 * @description Method to fetch all users who follow me
 * @static
 * @param {object} req client request
 * @param {object} res server response
 * @returns {Object} server response object
 * @memberof FollowController
 */
  static async listOfFollowersOrFollowed(req, res) {
    try {
      const { followersOrFollowing } = req.params;
      const user = await models.user.findOne({ where: { email: req.auth.email } });
      let columnAndValue, associationAs, message;
      switch (followersOrFollowing) {
        case 'followers':
          associationAs = 'followerDetails';
          message = 'You currently do not have any followers'; // message to be displayed if this user has no followers
          columnAndValue = { followedUserId: user.id };
          break;
        case 'following':
          associationAs = 'authorDetails';
          message = 'You currently do not follow anyone'; // message to be displayed if this user follows no one
          columnAndValue = { followerId: user.id };
          break;
        default:
          util.setError(404, 'Resource not found');
          return util.send(res);
      }
      // get followers or people you follow
      const myPeople = await models.Follow.findAll({
        where: columnAndValue,
        attributes: [],
        include: [
          {
            model: models.user,
            attributes: [
              'firstname',
              'lastname',
              'username',
              'email'
            ],
            as: associationAs
          }
        ]
      });
      if (myPeople.length === 0) {
        util.setSuccess(200, message, null);
        return util.send(res);
      }
      const response = ((followersOrFollowing === 'followers') ? myPeople.map(item => ({
        email: item.authorDetails.email, username: item.authorDetails.username, bio: item.authorDetails.bio, imageUrl: item.authorDetails.imageUrl
      })) : myPeople.map(item => ({
        email: item.authorDetails.email, username: item.authorDetails.username, bio: item.authorDetails.bio, imageUrl: item.authorDetails.imageUrl
      })));
      return res.status(200).json({ following: response, count: response.length });
    } catch (error) {
      util.setError(400, error.message);
      return util.send(res);
    }
  }
}
export default FollowController;
