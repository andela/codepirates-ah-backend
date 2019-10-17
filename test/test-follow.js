import sinon from 'sinon';
import { chai, server, expect } from './test-setup';
import followController from '../src/controllers/follow.controller';
import EmailHelper from '../src/helpers/verification-email';
import Helper from '../src/helpers/helper';

let usertoken;
let userThreeToken;
describe('test for following and unfollowing a user', () => {
  usertoken = Helper.generateToken({
    id: 3,
    email: 'user@gmail.com',
    username: 'username',
    verified: true
  });
  userThreeToken = Helper.generateToken({
    id: 5,
    email: 'userthree@gmail.com',
    username: 'userthree',
    verified: true
  });

  it('test for following a user', async () => {
    const req = {
      params: { userId: 5 },
      auth: {
        email: 'user@gmail.com'
      }
    };
    const res = {
      status() { },
      send() { },
      json() { }
    };
    sinon.stub(res, 'status').returnsThis();
    sinon.stub(EmailHelper, 'sendEmail').returns(true);
    await followController.follow(req, res);
    expect(res.status).to.have.been.calledWith(200);
  });
  it('test for getting all users you follow', (done) => {
    chai.request(server)
      .get('/api/v1/users/profiles/following')
      .send({})
      .set('Authorization', usertoken)
      .end((error, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('following');
        expect(res.body).to.have.property('count');
        done();
      });
  });
  it('test for getting all my followers', (done) => {
    chai.request(server)
      .get('/api/v1/users/profiles/followers')
      .send({})
      .set('Authorization', usertoken)
      .end((error, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        done();
      });
  });
  it('test for unfollowing a user', (done) => {
    chai.request(server)
      .post('/api/v1/users/profiles/5/follow')
      .send({})
      .set('Authorization', usertoken)
      .end((error, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.contain('You have unfollowed');
        done();
      });
  });
  it('test for wrong id of the user you want to follow', (done) => {
    chai.request(server)
      .post('/api/v1/users/profiles/ty6/follow')
      .send({})
      .set('Authorization', usertoken)
      .end((error, res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.contain('userId must be a non negative integer');
        done();
      });
  });
  it('test for a non existing user ', (done) => {
    chai.request(server)
      .post('/api/v1/users/profiles/199990/follow')
      .send({})
      .set('Authorization', usertoken)
      .end((error, res) => {
        expect(res.status).to.equal(404);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.contain('user does not exist');
        done();
      });
  });
  it('test for user not being able to follow himself', (done) => {
    chai.request(server)
      .post('/api/v1/users/profiles/3/follow')
      .send({})
      .set('Authorization', usertoken)
      .end((error, res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.contain('You cannot follow yourself');
        done();
      });
  });
  it('test for userthree following usertwo', async () => {
    const req = {
      params: { userId: 3 },
      auth: {
        email: 'userthree@gmail.com'
      }
    };
    const res = {
      status() { },
      send() { },
      json() { }
    };
    sinon.stub(res, 'status').returnsThis();
    await followController.follow(req, res);
    expect(res.status).to.have.been.calledWith(200);
  });
  it('test for getting all my followers when there are there', (done) => {
    chai.request(server)
      .get('/api/v1/users/profiles/followers')
      .send({})
      .set('Authorization', usertoken)
      .end((error, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        done();
      });
  });
});
