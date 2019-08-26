/* eslint-disable require-jsdoc */
let resp;
class tagHelper {
  static addArticleTags(tags) {
    if (tags[0].length === 0) {
      resp = [200, { message: `article already tagged as ${tags[1].join(', ')}`, data: tags[2] }];
    } else if (tags[1].length === 0) {
      resp = [201, { message: `article tagged as ${tags[0].join(', ')}`, data: tags[2] }];
    } else {
      resp = [200, { message: `article already tagged as ${tags[1].join(', ')}; new tagging ${tags[0].join(', ')} added`, data: tags[2] }];
    }
  }

  static async tagLimit(tags) {
    if (tags.length >= 5) {
      // eslint-disable-next-line no-return-assign
      return resp = [403, { message: 'this article already has the maximum permissible number of tags' }];
    }
  }

  static send(res) {
    return res.status(resp[0]).json(resp[1]);
  }
}

export default tagHelper;
