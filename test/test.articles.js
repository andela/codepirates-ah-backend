import fs from 'fs';
import 'dotenv/config';
import Helper from '../src/helpers/helper';
import { chai, server, expect } from './test-setup';

const usertoken = Helper.generateToken({
  id: 2,
  email: 'user@gmail.com',
  username: 'user',
  verified: false
});

describe('Articles', () => {
  it('throw error when fields are missing', (done) => {
    chai
      .request(server)
      .post('/api/v1/articles')
      .set('Content-Type', 'application/json')
      .set('Authorization', usertoken)
      .field('tagList', 'tag1, tag2, tag3')
      .attach('images', fs.readFileSync(`${__dirname}/mock/pic.jpeg`), 'pic.jpeg')
      .end((err, res) => {
        expect(res.status).to.be.deep.equal(400);
        expect(res.body).to.have.deep.property('status');
      });
    done();
  });
  it('create an article', (done) => {
    chai
      .request(server)
      .post('/api/v1/articles')
      .set('Content-Type', 'application/json')
      .set('Authorization', usertoken)
      .field('title', 'Title')
      .field('body', 'body field')
      .field('description', 'description is here')
      .field('tagList', 'tag1, tag2, tag3')
      .attach('images', fs.readFileSync(`${__dirname}/mock/pic.jpeg`), 'pic.jpeg')
      .end((err, res) => {
        expect(res.status).to.be.deep.equal(201);
        expect(res.body).to.have.deep.property('status');
        expect(res.body).to.have.deep.property('article');
      });
    done();
  });
});
