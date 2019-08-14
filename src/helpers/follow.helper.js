import Util from 'util';
import models from '../models/index';

const util = new Util();

const { Users } = models;

export default async (req, res) => {
  const { email } = req.params;

  const user = await Users.findOne({ where: { email } });

  if (!user) {
    util.setError(404, 'user does not exist');
    return util.send(res);
  }

  if (req.auth.email === user.email) {
    util.setError(400, 'You cannot follow yourself');
    return util.send(res);
  }

  return { user, followerId: req.auth.email };
};
