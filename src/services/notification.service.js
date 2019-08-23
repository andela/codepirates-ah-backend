import models from '../models/index';
import sendEmail from './email';
import { newArticleTemplate, newCommentOnFavoritedArticlesTemplate } from './email.template';


/**
 * @description Contains all email and in app notification services
 * @export
 * @class NotificationServices
 */
class NotificationServices {
  /**
   *
   * @description  Method to notify a user's followers via email/push when an article is published
   * @static
   * @param {object} req client request
   * @param {object} res server response
   * @param {string} slug article slug
   * @returns {Object} server response object
   * @memberof NotificationServices
   */
  static async notifyViaEmailAndPush(req, res, slug) {
    try {
      const followedUser = await models.user.findOne({ where: { email: req.auth.email } });
      const myFollowers = await models.Follow.findAll({
        where: { followedUserId: followedUser.id },
        attributes: [],
        include: [
          {
            model: models.user,
            attributes: ['id', 'username', 'email', 'subscribed', 'inAppNotification'],
            as: 'followerDetails'
          }
        ]
      });
      if (myFollowers.length === 0) return;
      const myFollowersWithEmailSub = myFollowers
        .map(item => ({
          id: item.followerDetails.id,
          username: item.followerDetails.username,
          email: item.followerDetails.email,
          subscribed: item.followerDetails.subscribed
        }))
        .filter(eachUser => eachUser.subscribed === true);
      const myFollowersWithInAppSub = myFollowers
        .map(item => ({
          inAppNotification: item.followerDetails.inAppNotification,
          id: item.followerDetails.id
        }))
        .filter(eachUser => eachUser.inAppNotification === true);
      const message = `${followedUser.username} just published an article`;
      const location = `${process.env.BACKEND_URL}/api/${process.env.API_VERSION}`;
      const url = `${location}/api/v1/articles/${slug}`;


      if (myFollowersWithEmailSub.length !== 0) {
        const myFollowersEmail = myFollowersWithEmailSub.map(each => each.email);
        const emailTemplate = newArticleTemplate(followedUser.username, url);
        await sendEmail(myFollowersEmail, `${message}`, emailTemplate);
      }

      if (myFollowersWithInAppSub.length !== 0) {
        myFollowersWithInAppSub.forEach(user => models.AppNotification.create({
          articleSlug: slug, receiverId: user.id, category: 'publish', read: false, message
        }));
      }
    } catch (error) {
      return (error);
    }
  }

  /**
   *
   * @description Notify users via email/push when a favorited article has new comment
   * @static
   * @param {object} req client request
   *  @param {object} res server response
   * @param {string} articleId client request
   * @param {string} slug client request
   * @returns {Object} server response object
   * @memberof NotificationServices
   */
  static async notifyUsersWhoFavorited(req, res, articleId, slug) {
    try {
      // returns an array of userIDs have favorited the article commented on
      const arrayOfUserIDs = await models.Favorites.findAll({ where: { articleId } }).map(item => item.dataValues.userId);

      // An array of users who have subcribed to Email notification
      const arrayOfAllUsersEmailWithEmailSub = await models.user.findAll({
        where: { subscribed: true },
        attributes: ['id', 'email', 'subscribed']
      }).map(eachUserObject => ({
        id: eachUserObject.dataValues.id,
        email: eachUserObject.dataValues.email
      }));

      // An array of users who have favorited the article AND also subcribed to Email notification
      const usersWhoFavoritedWithEmailSub = arrayOfAllUsersEmailWithEmailSub.filter((_eachUser, index) => arrayOfUserIDs.includes(arrayOfAllUsersEmailWithEmailSub[index].id));

      // notify via email
      if (usersWhoFavoritedWithEmailSub.length !== 0) {
        const emailAddresses = usersWhoFavoritedWithEmailSub.map(each => each.email);
        const location = `${process.env.BACKEND_URL}/api/${process.env.API_VERSION}`;
        const url = `${location}/api/v1/articles/${slug}`;
        const emailTemplate = newCommentOnFavoritedArticlesTemplate(req.auth.username, url);
        await sendEmail(emailAddresses, 'Hi there', emailTemplate);
      }

      // An array of usersID currently subcribed to In-App notification
      const arrayOfUserIDsWithInAppNot = await models.user.findAll({
        where: { inAppNotification: true },
        attributes: ['id', 'inAppNotification']
      }).map(userCol => userCol.dataValues.id);
      // An array of usersID who have favorited the article and are subcribed to In-app notification
      const usersWhoFavoritedAndHaveInAppNot = arrayOfUserIDs.filter(eachId => arrayOfUserIDsWithInAppNot.indexOf(eachId) !== -1);
      // notify via In app
      if (usersWhoFavoritedAndHaveInAppNot.length !== 0) {
        const message = `${req.auth.username} just commented on an article you favorited`;
        usersWhoFavoritedAndHaveInAppNot.forEach(userID => models.AppNotification.create({
          articleSlug: slug, receiverId: userID, category: 'comment', read: false, message
        }));
      }
    } catch (error) {
      return (error);
    }
  }
}
export default NotificationServices;
