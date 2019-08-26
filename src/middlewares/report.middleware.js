import Util from '../helpers/util';
import models from '../models/index';

const util = new Util();

export default async (req, res, next) => {
  try {
    const ArticleSlug = req.params.Article;
    const post = await models.Article.findOne({ where: { slug: ArticleSlug } });

    if (!post) {
      util.setError(404, 'post not found');
      return util.send(res);
    }
    const user = await models.user.findOne({ where: { email: req.auth.email } });
    if (!user) {
      util.setError(404, 'you are anonimous');
      return util.send(res);
    }
    const userId = user.id;
    if (userId === post.authorId) {
      util.setError(403, 'Sorry you can not report your article.');
      return util.send(res);
    }

    const Report = await models.reporting.findOne({ where: { articleSlug: ArticleSlug, userId } });
    if (Report) {
      util.setError(403, 'You arleady Reported this article.');
      return util.send(res);
    }
    next();
  } catch (error) {
    util.setError(500, 'server error contact admin');
    return util.send(res);
  }
};
