import models from '../models/index';


export default async (req, res, next, userColumn) => {
  const userDetails = await models.user.findOne({ where: { email: req.auth.email } });
  const { id } = userDetails;
  try {
    const user = await models.user.findOne({ where: { id }, attributes: ['id', 'email', userColumn] });

    // This toggles the bolean value
    const newNotificationStatus = !user.dataValues[userColumn];

    const updatedUser = await models.user.update(
      {
        [userColumn]: newNotificationStatus,
      },
      {
        where: { id },
        returning: true
      }
    );
    // eslint-disable-next-line no-nested-ternary
    const message = (((userColumn === 'subscribed') && (updatedUser[1][0].dataValues.subscribed === newNotificationStatus)) ? (updatedUser[1][0].dataValues.subscribed === true) ? 'You have successfully subscribed to our email notifications' : 'You will no longer receive email notifications from us' : (updatedUser[1][0].dataValues.inAppNotification === true) ? 'You have successfully subscribed to in app notifications' : 'You will no longer receive in-app notifications from us');
    return res.status(200).json({ message, statusCode: 200 });
  } catch (error) {
    return next(error);
  }
};
