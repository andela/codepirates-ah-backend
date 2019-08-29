import Util from '../helpers/util';
import models from '../models/index';

const util = new Util();

export default async (req, res, next) => {
  try {
    const user = await models.user.findOne({ where: { email: req.auth.email } });
    const userId = user.id;
    if (!user) {
      util.setError(404, 'you are anonimous');
      return util.send(res);
    }
    const ArticleSlug = req.params.Article;
    const post = await models.Article.findOne({ where: { slug: ArticleSlug } });

    if (!post) {
      util.setError(404, 'post not found');
      return util.send(res);
    }
    const like = await models.Likes.findOne({ where: { ArticleSlug, userId } });
    if (!like) {
      req.body.author = post.authorId;
      req.body.userId = userId;
      req.body.likeId = null;
      req.body.claps = null;
      req.body.author = post.authorId;
      next();
    } else {
      req.body.author = post.authorId;
      req.body.likeId = like.id;
      req.body.claps = like.claps;
      req.body.userId = userId;
      req.body.status = like.status;
      next();
    }
  } catch (error) {
    util.setError(500, 'server error');
    return util.send(res);
  }
};
