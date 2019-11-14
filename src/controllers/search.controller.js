import _ from "lodash";
import moment from "moment";
import ArticleModel from "../services/article.service";
import UserModel from "../services/user.service";
import TagModel from "../services/tag.service";
import Util from "../helpers/util";
import Helper from "../helpers/helper";

const util = new Util();
/**
 *
 *
 * @class Report
 */
class Search {
  /**
   *
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @return {Json} return json object
   * @memberof Search
   */
  static async processSearchQuery(req, res) {
    const { q, offset, limit } = req.query;
    const searchQuery = JSON.parse(q);
    const articles = await ArticleModel.searchArticle(
      searchQuery.keyword,
      offset,
      limit
    );
    const foundArticles = _.map(
      articles,
      _.partialRight(_.pick, [
        "authorId",
        "slug",
        "title",
        "description",
        "body",
        "taglist",
        "favorited",
        "favoritedcount",
        "flagged",
        "images",
        "views",
        "createdAt"
      ])
    );

    await Promise.all(
      foundArticles.map(async article => {
        try {
          const userDetails = await UserModel.getOneUser(article.authorId);
          const { username, image } = userDetails;
          const readTime = Helper.calculateReadTime(article.body);
          const timeAgo = moment(article.createdAt).fromNow();
          article.readtime = readTime;
          article.username = username;
          article.userImage = image;
          article.timeCreated = timeAgo;
          return true;
        } catch (error) {
          console.log(error);
        }
      })
    );
    let duplicateFoundTags = [];
    foundArticles.map(article => {
      const articleTags = article.taglist;
      const found = articleTags.filter(
        articleTag => articleTag === searchQuery.tag
      );
      if (found.length >= 1) {
        for (let i = 0; i <= found.length - 1; i++) {
          duplicateFoundTags = [found[i], ...duplicateFoundTags];
        }
      }
    });

    let foundTags = duplicateFoundTags.filter(
      (item, index) => duplicateFoundTags.indexOf(item) === index
    );
    if (foundTags[0] === "") {
      foundTags = [];
    }
    const users = await UserModel.searchUser(searchQuery.user, offset, limit);
    const foundUsers = _.map(
      users,
      _.partialRight(_.pick, ["username", "image", "bio"])
    );
    util.setSuccess(200, "Search successful", {
      foundArticles,
      foundUsers,
      foundTags
    });
    return util.send(res);
  }
}

export default Search;
