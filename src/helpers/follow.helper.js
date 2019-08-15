import Util from './util';
import models from '../models/index';

const util = new Util();

export default async (req, res) => {
  const followedUser = await models.user.findOne({ where: { id: req.params.userId } });
  const followerUser = await models.user.findOne({ where: { email: req.auth.email } });
  if (!followedUser) {
    util.setError(404, 'user does not exist');
    return util.send(res);
  }
  if (followerUser.email === followedUser.email) {
    util.setError(400, 'You cannot follow yourself');
    return util.send(res);
  }

  return {
    followedUser, followerUser
  };
};
