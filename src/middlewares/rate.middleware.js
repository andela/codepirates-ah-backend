import Util from '../helpers/util';
import models from '../models/index';

const util = new Util();

export default async (req, res, next) => {
  try {
    const ArticleSlug = req.params.articleSlug;
    const post = await models.Article.findOne({ where: { slug: ArticleSlug } });
    if (!post) {
      util.setError(404, 'post not found');
      return util.send(res);
    }
    const user = await models.user.findOne({ where: { email: req.auth.email } });
    const userId = user.id;
    if (userId === post.authorId) {
      util.setError(400, 'You cannot rate your own article');
      return util.send(res);
    }
    next();
  } catch (error) {
    util.setError(500, 'server error contact admin');
    return util.send(res);
  }
};
