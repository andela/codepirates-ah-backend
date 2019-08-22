import models from '../models/index';
import newFollowerTemplate from '../services/follower.service';
import sendEmail from '../services/email';
import followhelper from '../helpers/follow.helper';

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
 * @param  {Function} next passes control to the next middleware
 * @memberof FollowController
 */
  static async follow(req, res, next) {
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

          if (!process.env.NODE_ENV === 'test') {
            sendEmail(followedUser.email, `${message}`, emailTemplate);
          }
          return res.status(200).json({ status: '200', message: `You are now following ${followedUser.username}` });
        }

        await follow.destroy();
        return res.status(200).json({
          status: '200',
          message: `You have unfollowed ${followedUser.username}`
        });
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   *
   * @description Method to fetch all users who I follow
   * @static
   * @param {object} req client request
   * @param {object} res server response
   * @returns {Object} server response object
   * @param  {Function} next passes control to the next middleware
   * @memberof FollowController
   */
  static async listOfFollowedUsers(req, res, next) {
    try {
      const follower = await models.user.findOne({ where: { email: req.auth.email } });
      const usersIfollow = await models.Follow.findAll({
        where: { followerId: follower.id },
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
            as: 'authorDetails'
          }
        ]
      });
      if (usersIfollow.length === 0) {
        return res.status(200).json({ status: 200, message: 'You currently do not follow anyone' });
      }
      const response = usersIfollow.map(item => (
        {
          username: item.authorDetails.username,
          firstname: item.authorDetails.firstname,
          lastname: item.authorDetails.lastname,
          email: item.authorDetails.email
        }
      ));
      return res.status(200).json({ following: response, count: response.length });
    } catch (error) {
      return next(error);
    }
  }

  /**
 *
 * @description Method to fetch all users who follow me
 * @static
 * @param {object} req client request
 * @param {object} res server response
 * @returns {Object} server response object
 * @param {Function} next passes control to the next middleware
 * @memberof FollowController
 */
  static async listOfFollowers(req, res, next) {
    try {
      const followedUser = await models.user.findOne({ where: { email: req.auth.email } });
      const myFollowers = await models.Follow.findAll({
        where: { followedUserId: followedUser.id },
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
            as: 'followerDetails'
          }
        ]
      });
      if (myFollowers.length === 0) {
        return res.status(200).json({ status: 200, message: 'You currently do not have any followers' });
      }
      const response = myFollowers.map(item => (
        {
          email: item.followerDetails.email,
          username: item.followerDetails.username,
          bio: item.followerDetails.bio,
          imageUrl: item.followerDetails.imageUrl
        }
      ));
      return res.status(200).json({ following: response, count: response.length });
    } catch (error) {
      return next(error);
    }
  }
}
export default FollowController;
