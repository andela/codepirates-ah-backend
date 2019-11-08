import express from 'express';
import validateToken from '../../../middlewares/auth';
import NotificationController from '../../../controllers/notifications.controller';

const router = express.Router();
const { notification, getUserNotification, updateNotificationStatus } = NotificationController;

// req.params can only be 'email' or 'inApp''
router.patch('/:emailOrInApp', validateToken, notification);
router.get('/', validateToken, getUserNotification);
router.put('/:id', validateToken, updateNotificationStatus);

export default router;
