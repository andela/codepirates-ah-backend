import notificationHelper from '../helpers/notification.helper';
import models from '../models/index';


/**
 * @description Contains method to allow users opt in and out of notifications
 * @export
 * @class NotificationController
 */
class NotificationController {
  /**
 *
 * @description Method to opt in and out of email and push notication
 * @static
 * @param {object} req client request
 * @param {object} res server response
 * @returns {Object} server response object
 * @param  {Function} next passes control to the next middleware
 * @memberof NotificationController
 */
  static async notification(req, res, next) {
    const { emailOrInApp } = req.params;

    switch (emailOrInApp) {
      case 'email':
        notificationHelper(req, res, next, 'subscribed');
        break;
      case 'inApp':
        notificationHelper(req, res, next, 'inAppNotification');
        break;
      default:
        return res.status(404).json({ error: 'route does not exist' });
    }
  }

  /**
 *
 * @description Method to get user notifications
 * @static
 * @param {object} req client request
 * @param {object} res server response
 * @returns {Object} server response object
 * @param  {Function} next passes control to the next middleware
 * @memberof NotificationController
 */
  static async getUserNotification(req, res) {
    try {
      const user = req.auth;
      const usersNotifications = await models.AppNotification.findAll({
        where: { receiverId: user.id },
      });
      if (usersNotifications.length === 0) {
        return res.status(404).json({ status: 404, message: 'You currently do not have notifications' });
      }
      return res.send({ notifications: usersNotifications });
    } catch (error) {
      return res.send({ error: error.message });
    }
  }
}
export default NotificationController;
