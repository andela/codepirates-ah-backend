import env from 'dotenv';
import jwt from 'jsonwebtoken';

import models from '../models';
import auth from '../middlewares/auth';
import Util from '../helpers/util';
import result from '../helpers/bookmarks';


const util = new Util();

const notFound = (msg) => {
    util.setError(404, `${msg} not found`);
    return util;
};

const addArticles = (additions) => {
    result.addArticleTags(additions);
    return result;
};

const {
    Article, BookMark, user
} = models;

class BookMarkController {
    static async createBookMark(req, res) {
        const name = req.body.name || `Bookmark-${new Date()}`;
        const { articleId } = req.params;
        let userId;
        let token = req.headers['x-access-token'] || req.headers.authorization;
        if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length);
        }
        if (token) {
            jwt.verify(token, process.env.SECRET_KEY, (err, decode) => {
                if (err) {
                    return res.status(401).json({
                        message: 'Token is not valid'
                    });
                }
                req.token = token;
                userId = decode.id;
                console.log(userId);
            });
            BookMark.findOrCreate({
                where: { userId, articleId, name }
            }).then((bookmark) => {
                if (bookmark[1]) {
                    return res.status(201).json({
                        message: `bookmark ${name} created`, data: bookmark[0]
                    });
                }
                res.status(200).json({
                    message: `bookmark ${name} exists`, data: bookmark[0]
                });
            })
        }
    }

    static async editBookMark(req, res) {
        const { name } = req.params;
        const newName = req.body.name;
        BookMark.update({ name: newName }, {
            where: { name },
            returning: true,
        }).then(updated => res.status(200).json({
            message: `tag ${name} updated to ${newName}`, data: updated[1]
        }))
    }

    // static async editArticleTag(req, res) {
    //     const newTag = await Tag.findOrCreate({
    //         where: { name: req.body.name }
    //     });
    //     ArticleTag.update(
    //         { tagId: newTag[0].id, articleId: req.params.articleId },
    //         {
    //             where: {
    //                 tagId: req.params.tagId, articleId: req.params.articleId
    //             },
    //             returning: true,
    //             raw: true
    //         }
    //     ).then((updated) => {
    //         if (updated[0] !== 0) {
    //             return res.status(200).json({ message: 'update successful', data: updated[1][0] });
    //         }
    //         notFound(`Target tag for this article`).send(res);
    //     })
    // }

    // static async getTags(req, res) {
    //     Tag.findAll({ include: ['articles'] })
    //         .then((tags) => {
    //             res.status(200).json({ tags });
    //         })
    // }

    // static getTag(req, res) {
    //     Tag.findOne({
    //         where: { name: req.params.name },
    //         include: ['articles']
    //     }).then((tag) => {
    //         if (tag) {
    //             return res.status(200).json({
    //                 tag: {
    //                     id: tag.id, name: tag.name, articleCount: tag.articles.length
    //                 }
    //             });
    //         }
    //     })
    // }

    // static async getTagArticles(req, res) {
    //     Tag.findAll({
    //         where: { name: req.params.name },
    //         include: ['articles'],
    //     }).then((articles) => {
    //         if (articles[0].articles.length === 0) {
    //             return notFound(`articles about ${req.params.name}`).send(res);
    //         }
    //         res.status(200).json({
    //             articles: articles.map(element => element.articles)
    //         });
    //     })
    // }

    static async getUserBookMarks(req, res) {
        const name = req.body.name || `Bookmark-${new Date()}`;
        const { articleId } = req.params;
        let userId;
        let token = req.headers['x-access-token'] || req.headers.authorization;
        if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length);
        }
        if (token) {
            jwt.verify(token, process.env.SECRET_KEY, (err, decode) => {
                if (err) {
                    return res.status(401).json({
                        message: 'Token is not valid'
                    });
                }
                req.token = token;
                userId = decode.id;
                console.log(userId);
            });
            user.findOne({
                where: { userId },
                include: ['articles']
            }).then((user) => {
                if (user.articles.length === 0) {
                    return res.status(200).json({ message: 'you have no bookmarks' });
                }
                res.status(200).json({ articles: user.articles.map(article => article.name) });
            })
        }
    }
    // static async deleteArticleTag(req, res) {
    //     ArticleTag.destroy({
    //         where: { articleId: req.params.articleId, tagId: req.params.tagId }
    //     }).then((deleted) => {
    //         if (deleted) {
    //             return res.status(200).json({
    //                 message: `tag with Id ${req.params.tagId} removed from article`
    //             });
    //         }
    //     })
    // }

    // static async deleteTagArticles(req, res) {
    //     Tag.findOne({
    //         where: { name: req.params.name },
    //         include: ['articles']
    //     }).then((tag) => {
    //         if (tag.articles.length === 0) {
    //             return res.status(404).json({
    //                 message: `no articles about ${req.params.name}`
    //             });
    //         }
    //         res.status(200).json({
    //             message: `all articles about ${req.params.name} deleted`
    //         });
    //     })
    // }
}

export default BookMarkController;
