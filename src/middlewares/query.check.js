import { Op } from 'sequelize';

export const searchArticleQuerybuilder = (searchQueries) => {
  const validQueries = {
    author: 'authorId',
    keyword: 'description',
    title: 'title',
    tag: 'taglist'
  };
  let queries = {};

  Object.keys(searchQueries).forEach((key) => {
    queries = { ...queries, [validQueries[key]]: searchQueries[key] };
  });
  // wildcard search
  if (queries.description) {
    queries.description = {
      [Op.iLike]: `%${queries.description}%`
    };
  }
  if (queries.title) {
    queries.title = {
      [Op.iLike]: `%${queries.title}%`
    };
  }

  return queries;
};

export const checkQuery = (req, res, next) => {
  const {
    limit, offset, page, ...searchQueries
  } = req.query;
  const validQueries = ['author', 'keyword', 'tag', 'title'];
  let isValidRequest = true;
  let invalidQueries = [];

  if (Object.keys(searchQueries).length) {
    Object.keys(searchQueries).forEach((key) => {
      if (!validQueries.includes(key)) {
        isValidRequest = false;
        invalidQueries = [...invalidQueries, key];
      }
    });
  }

  if (isValidRequest) {
    req.searchQueries = searchArticleQuerybuilder(searchQueries);
    return next();
  }
  return res.status(400).json({
    error: {
      message: invalidQueries.map(key => `${key} is not allowed`)
    }
  });
};
