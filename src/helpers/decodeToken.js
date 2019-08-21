import env from 'dotenv';
import jwt from 'jsonwebtoken';

import { Article } from '../models';

const decodeToken = async (req) => {
    let userId;
    const { articleId } = req.body || '';
    let token = req.headers['x-access-token'] || req.headers.authorization; req.headers['x-access-token'] || req.headers.authorization;
    const defaultName = request.body.articleId ? await Article.findByPk(articleId): '';
    const name = req.baody ? req.body.name || `${defaultName.title}-${new Date()}`: '';
    if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length);
        }
    if (token) {
        jwt.verify(token, process.env.SECRET_KEY, (err, decode) => {
            if (err) {
                return null;
            }
            userId = decode.id
        });
    }
    return { userId, name, articleId };
}

export default decodeToken;