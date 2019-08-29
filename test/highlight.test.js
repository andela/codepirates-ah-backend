import sinon from 'sinon';
import { chai, server, expect } from './test-setup';
import Helper from '../src/helpers/helper';
import OpenUrlHelper from '../src/helpers/share.article.helper';
import highlightController from '../src/controllers/highlight.controller';
import shareMiddleware from '../src/middlewares/shareHighlight.middleware';


const adminToken = Helper.generateToken({
  id: 1,
  email: 'admin@gmail.com',
  username: 'admin',
  verified: true
});
const userToken = Helper.generateToken({
  id: 3,
  email: 'user@gmail.com',
  username: 'username',
  verified: true
});
const userTwoToken = Helper.generateToken({
  id: 4,
  email: 'usertwo@gmail.com',
  username: 'usertwo',
  verified: true
});

describe('Highlight', () => {
  it('should highlight', (done) => {
    chai
      .request(server)
      .post('/api/v1/articles/fakeslug/highlight?startIndex=0&&endIndex=30')
      .set('Authorization', adminToken)
      .send({
        comment: 'this is a comment'
      })
      .end((error, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status', 'success');
        expect(res.body).to.have.property('message', 'Success highligt and comment');
        expect(res.body).to.have.property('data');
        done();
      });
  });
  it('test for sharing an article via facebook', async () => {
    const req = {
      params: { id: 1, channel: 'facebook' },
    };
    const res = {
      status() { },
      send() { },
      json() { }
    };
    sinon.stub(res, 'status').returnsThis();
    sinon.stub(OpenUrlHelper, 'openUrl').returns(true);
    await highlightController.shareHightlight(req, res);
    expect(res.status).to.have.been.calledWith(201);
  });

  it('test for share middleware', async () => {
    const req = {
      params: { id: 1, channel: 'facebook' },
      url: 'http://localhost:3000/api/v1/articles/1/highlight/share/linkedin'
    };
    const res = {
      status() { },
      send() { },
      json() { }
    };

    const next = () => {};
    sinon.stub(res, 'status').returnsThis();
    await shareMiddleware(req, res, next);
  });
  it('test for sharing an article via twitter', async () => {
    const req = {
      params: { id: 1, channel: 'twitter' },
    };
    const res = {
      status() { },
      send() { },
      json() { }
    };
    sinon.stub(res, 'status').returnsThis();
    await highlightController.shareHightlight(req, res);
    expect(res.status).to.have.been.calledWith(201);
  });
  it('Should throw an error in case startindex or endindex is no a number', (done) => {
    chai
      .request(server)
      .post('/api/v1/articles/fakeslug/highlight?startIndex=t6&&endIndex=34')
      .set('Authorization', adminToken)
      .send({
        comment: 'this is a comment'
      })
      .end((error, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status', 'error');
        expect(res.body).to.have.property('message', 't6 and 34 should be a number');
        done();
      });
  });
  it('Should throw an error in case the article does not exist', (done) => {
    chai
      .request(server)
      .post('/api/v1/articles/Rwanda-nziza-1hpwggjdjzs/highlight?startIndex=34&&endIndex=78')
      .set('Authorization', adminToken)
      .send({
        comment: 'this is a comment'
      })
      .end((error, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status', 'error');
        expect(res.body).to.have.property('message', 'Sorry, that article does not exists');
        done();
      });
  });
  it('Should throw an error in case the article does not exist', (done) => {
    chai
      .request(server)
      .post('/api/v1/articles/Rwanda-nziza-1hpwggjdjzs/highlight?startIndex=34&&endIndex=78')
      .set('Authorization', adminToken)
      .send({
        comment: 'this is a comment'
      })
      .end((error, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status', 'error');
        expect(res.body).to.have.property('message', 'Sorry, that article does not exists');
        done();
      });
  });
  it('should throw an error when the highlight indexes are out of article body range', (done) => {
    chai
      .request(server)
      .post('/api/v1/articles/fakeslug/highlight?startIndex=-10&&endIndex=3000000000000000000')
      .set('Authorization', adminToken)
      .send({
        comment: 'this is a comment'
      })
      .end((error, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status', 'error');
        expect(res.body).to.have.property('message', 'Sorry, -10 and 3000000000000000000 should be in the range of the body length.');
        done();
      });
  });
  it('should throw an error when user wants to so an empty highlight', (done) => {
    chai
      .request(server)
      .post('/api/v1/articles/fakeslug/highlight?startIndex=0&&endIndex=0')
      .set('Authorization', adminToken)
      .send({
        comment: 'this is a comment'
      })
      .end((error, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status', 'error');
        expect(res.body).to.have.property('message', 'Sorry you can not highlight or comment on an empty highlight');
        done();
      });
  });
  it('should throw an error when someone tries to delete a comment of highlight that does not belong to him', (done) => {
    chai
      .request(server)
      .delete('/api/v1/articles/highlight/1')
      .set('Authorization', userToken)
      .end((error, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status', 'error');
        expect(res.body).to.have.property('message', 'Sorry you can not delete this comment');
        done();
      });
  });
  it('should delete a comment of a highlight', (done) => {
    chai
      .request(server)
      .delete('/api/v1/articles/highlight/1')
      .set('Authorization', adminToken)
      .end((error, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status', 'success');
        expect(res.body).to.have.property('message', 'Successfully updated');
        expect(res.body).to.have.property('data');
        done();
      });
  });
  it('should throw an error when the comment of the highlight has been already deleted', (done) => {
    chai
      .request(server)
      .delete('/api/v1/articles/highlight/1')
      .set('Authorization', adminToken)
      .end((error, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status', 'error');
        expect(res.body).to.have.property('message', 'Sorry comment not found');
        done();
      });
  });
  it('should throw an error when there is no highlight', (done) => {
    chai
      .request(server)
      .delete('/api/v1/articles/highlight/2')
      .set('Authorization', adminToken)
      .end((error, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status', 'error');
        expect(res.body).to.have.property('message', 'Sorry that highlight does not exists');
        done();
      });
  });
  it('should highlight second time', (done) => {
    chai
      .request(server)
      .post('/api/v1/articles/fakeslug/highlight?startIndex=20&&endIndex=89')
      .set('Authorization', adminToken)
      .send({
        comment: 'this is a comment of the second highlight'
      })
      .end((error, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status', 'success');
        expect(res.body).to.have.property('message', 'Success highligt and comment');
        expect(res.body).to.have.property('data');
        done();
      });
  });
  it('should highlight third time', (done) => {
    chai
      .request(server)
      .post('/api/v1/articles/fakeslug/highlight?startIndex=10&&endIndex=40')
      .set('Authorization', adminToken)
      .send({
        comment: 'this is a comment of third highlight'
      })
      .end((error, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status', 'success');
        expect(res.body).to.have.property('message', 'Success highligt and comment');
        expect(res.body).to.have.property('data');
        done();
      });
  });
  it('should get all the highlights of a particular article', (done) => {
    chai
      .request(server)
      .get('/api/v1/articles/1/highlight')
      .set('Authorization', adminToken)
      .send({
        comment: 'this is a comment of third highlight'
      })
      .end((error, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status', 'success');
        expect(res.body).to.have.property('message', 'All highlights of this article');
        expect(res.body).to.have.property('data');
        done();
      });
  });
  it('should throw an error when getting highlights which are not yours', (done) => {
    chai
      .request(server)
      .get('/api/v1/articles/1/highlight')
      .set('Authorization', userTwoToken)
      .end((error, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status', 'error');
        expect(res.body).to.have.property('message', 'Sorry, you are not authorized to access these highlights');
        done();
      });
  });
});
