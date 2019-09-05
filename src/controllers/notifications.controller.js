import notificationHelper from '../helpers/notification.helper';
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
        util.setError(404, 'route does not exist');
        return util.send(res);
    }
  }
}
export default NotificationController;
