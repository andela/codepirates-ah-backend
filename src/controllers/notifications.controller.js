import notificationHelper from '../helpers/notification.helper';
import models from '../models/index';
import Util from '../helpers/util';

const util = new Util();

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
 * @description Method to opt in and out of email and push notication
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
      const userNotification = await models.AppNotification.findAll({
        where: { receiverId: user.id },
      });
      if (userNotification.length === 0) {
        util.setError(404, 'You currently do not have notifications');
        return util.send(res);
      }
      util.setSuccess(200, 'notifications', userNotification);
      return util.send(res);
    } catch (error) {
      util.setError(400, { error: error.message });
      return util.send(res);
    }
  }

  /**
 *
 * @description Method to change notification status to true
 * @static
 * @param {object} req client request
 * @param {object} res server response
 * @returns {Object} server response object
 * @param  {Function} next passes control to the next middleware
 * @memberof NotificationController
 */
  static async updateNotificationStatus(req, res) {
    try {
      const { id } = req.params;
      const userNotification = await models.AppNotification.findOne({
        where: { id }
      });
      if (userNotification) {
        await models.AppNotification.update({
          read: true,
        }, { where: { id } });
        util.setSuccess(200, 'Notification has been retrieved', null);
        return util.send(res);
      }
      util.setError(404, { message: 'Notification Not Found' });
      return util.send(res);
    } catch (error) {
      util.setError(400, { error: error.message });
      return util.send(res);
    }
  }
}
export default NotificationController;
