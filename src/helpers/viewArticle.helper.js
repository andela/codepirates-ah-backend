import models from '../models';
import Util from './util';

const util = new Util();
const db = models.Article;
const viewDb = models.View;

const viewArticleHelper = async (req, res, slug) => {
  const findArticle = await db.findOne({ where: { slug } });
  if (!findArticle) {
    util.setError(404, 'That article does not exist');
    util.send(res);
  }
  // find ip address
  const ipAddress = req.header('x-forwarded-for') || req.connection.remoteAddress;

  // check if the article was viewed
  const findViewsOfArticle = await viewDb.findOne({ where: { articleId: findArticle.id } });

  let viewObject = {
    articleId: findArticle.id,
    userId: req.auth ? req.auth.id : null,
    IP_address: ipAddress,
    userType: req.auth ? 'loggedInUser' : 'guest',
    views: 1
  };
  // update or create article views
  if (findViewsOfArticle) {
    viewObject = { ...viewObject, views: findViewsOfArticle.views + 1 };
    await viewDb.update(viewObject, {
      where: {
        articleId: findArticle.id
      },
      returing: true
    });
  } else {
    await viewDb.create(viewObject);
  }
  return {
    views: findViewsOfArticle.views
  };
};

export default viewArticleHelper;
