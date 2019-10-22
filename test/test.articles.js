import fs from 'fs';
import sinon from 'sinon';
import 'dotenv/config';
import Helper from '../src/helpers/helper';
import { chai, server, expect } from './test-setup';
import cloudinary from '../src/helpers/cloudinaryHelper';
import articleController from '../src/controllers/articles.controller';

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
      .set('authorization', usertoken)
      .attach(
        'images',
        fs.readFileSync(`${__dirname}/mock/pic.jpeg`),
        'pic.jpeg'
      )
      .end((err, res) => {
        expect(res.status).to.be.deep.equal(400);
        expect(res.body).to.have.deep.property('status');
        done();
      });
  });
  it('create an article', async () => {
    const req = {
      auth: {
        id: 1
      },
      body: {
        files: 'nshuti',
        title: 'title1',
        description: 'hello world',
        body: 'hello world'
      }
    };
    const res = {
      status() {},
      send() {},
      json() {}
    };
    sinon.stub(res, 'status').returnsThis();
    sinon.stub(cloudinary, 'generateCloudinaryUrl').returns([]);
    await articleController.createArticles(req, res);
    expect(res.status).to.have.been.calledWith(201);
  });
  it('List of all articles', (done) => {
    chai
      .request(server)
      .get('/api/v1/articles')
      .end((err, res) => {
        expect(res.status).to.be.deep.equal(200);
        expect(res.body).to.have.deep.property(
          'message',
          'List of all articles'
        );
        done();
      });
  });
  it('view single article', (done) => {
    chai
      .request(server)
      .get('/api/v1/articles/fakeslug')
      .end((err, res) => {
        expect(res.status).to.be.deep.equal(200);
        expect(res.body).to.have.deep.property(
          'message',
          'Article successfully retrieved'
        );
        done();
      });
  });
  it('view list of articles for a specific user ', (done) => {
    chai
      .request(server)
      .get('/api/v1/articles/mine')
      .set('x-access-token', usertoken)
      .end((err, res) => {
        expect(res.status).to.be.deep.equal(200);
        done();
      });
  });
  it('should return resource not found message if endpoint does not exist', (done) => {
    chai
      .request(server)
      .get('/api/v1/articles/user/articless')
      .end((error, res) => {
        expect(res.status).to.be.equal(404);
        expect(res.body).to.have.deep.property('error', 'Resource not found');
        done();
      });
  });
});
