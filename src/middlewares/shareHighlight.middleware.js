import 'dotenv/config';
import Helper from '../services/article.service';
import Util from '../helpers/util';
import OpenUrlHelper from '../helpers/share.article.helper';

const util = new Util();


const { BACKEND_URL, API_VERSION } = process.env;

export default async (req, res, next) => {
  const { id } = req.params;
  const hightlight = await Helper.findHighlight(id);
  if ((hightlight === null) || (hightlight.length === 0)) {
    util.setError(404, 'Sorry you can not share a highlight that does not exist');
    return util.send(res);
  }
  const [{ text }, articleSlug] = [hightlight, hightlight.get().highlight.get().slug];
  if (req.url.search(/\/facebook/g) > 0) {
    await OpenUrlHelper.openUrl(`https://web.facebook.com/sharer/sharer.php?u=${text} ${BACKEND_URL}/api/${API_VERSION}/articles/${articleSlug}`);
  } else if (req.url.search(/\/twitter/g) > 0) {
    await OpenUrlHelper.openUrl(`https://twitter.com/intent/tweet?text=${text} ${BACKEND_URL}/api/${API_VERSION}/articles/${articleSlug}`);
  } else if (req.url.search(/\/linkedin/g) > 0) {
    await OpenUrlHelper.openUrl(`https://www.linkedin.com/sharing/share-offsite/?url=${text} ${BACKEND_URL}/api/${API_VERSION}/articles/${articleSlug}`);
  } else if (req.url.search(/\/gmail/g) > 0) {
    await OpenUrlHelper.openUrl(`mailto:?subject=${text}&&body=${BACKEND_URL}/api/${API_VERSION}/articles/${articleSlug}`);
  }
  next();
};
