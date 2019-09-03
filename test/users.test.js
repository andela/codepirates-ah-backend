import sinon from 'sinon';
import { chai, server, expect } from './test-setup';
import UserController from '../src/controllers/user.controller';
import sendPasswordResetEmailHelper from '../src/services/resetpassword.service';
import Helper from '../src/helpers/helper';

let adminToken;
let usertoken;
const userTwoToken = Helper.generateToken({
  id: 4,
  email: 'usertwo@gmail.com',
  username: 'usertwo',
  verified: true
});
describe('Users', () => {
  it("should return welcome to author's heaven message", (done) => {
    chai
      .request(server)
      .get('/')
      .end((error, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.deep.property('data', 'Welcome to Authors Haven.');
        done();
      });
  });
  it('should return resource not found message if endpoint does not exist', (done) => {
    chai
      .request(server)
      .get('/ii')
      .end((error, res) => {
        expect(res.status).to.be.equal(404);
        expect(res.body).to.have.deep.property('error', 'Resource not found');
        done();
      });
  });
  it('should sign up', async () => {
    const req = {
      body: {
        firstname: 'nshuti',
        lastname: 'jonath',
        email: 'maurice@gmmail.com',
        username: 'maurice',
        password: 'ASqw12345'
      }
    };
    const res = {
      status() { },
      send() { },
      json() { }
    };
    sinon.stub(res, 'status').returnsThis();
    await UserController.signup(req, res);
    expect(res.status).to.have.been.calledWith(201);
  });
  it('should sign up second user', async () => {
    const req = {
      body: {
        firstname: 'nshuti',
        lastname: 'jonath',
        email: 'minega25@gmail.com',
        username: 'mauricee',
        password: 'ASqw12e'
      }
    };
    const res = {
      status() { },
      send() { },
      json() { }
    };
    sinon.stub(res, 'status').returnsThis();
    await UserController.signup(req, res);
    expect(res.status).to.have.been.calledWith(201);
  });
  it('should throw error when user exists', (done) => {
    chai
      .request(server)
      .post('/api/v1/users/signup')
      .send({
        firstname: 'nshuti',
        lastname: 'jonath',
        email: 'maurice@gmmail.com',
        username: 'maurice',
        password: 'ASqw12345'
      })
      .end((error, res) => {
        expect(res.status).to.be.equal(409);
        expect(res.body).to.have.deep.property(
          'message',
          'An account with this email already exists'
        );
        done();
      });
  });
  it('should sign in the admin user', (done) => {
    chai
      .request(server)
      .post('/api/v1/users/login')
      .send({
        email: 'admin@gmail.com',
        password: 'ASqw12345'
      })
      .set('Accept', 'Application/JSON')
      .end((error, res) => {
        adminToken = `Bearer ${res.body.token}`;
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.deep.property('message', 'welcome back admin');
        expect(res.body).to.have.property('token');
        done();
      });
  });
  it('should sign in a normal user', (done) => {
    chai
      .request(server)
      .post('/api/v1/users/login')
      .send({
        email: 'userthree@gmail.com',
        password: 'ASqw12345'
      })
      .set('Accept', 'Application/JSON')
      .end((error, res) => {
        usertoken = `Bearer ${res.body.token}`;
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.deep.property('message', 'welcome back userthree');
        expect(res.body).to.have.property('token');
        done();
      });
  });
  it('should not sign in the user when email is incorrect', (done) => {
    chai
      .request(server)
      .post('/api/v1/users/login')
      .send({
        email: 'admfin@gmail.com',
        password: 'ASqw12345'
      })
      .end((error, res) => {
        expect(res.status).to.be.equal(404);
        done();
      });
  });
  it('should throw an error when password is not correct', (done) => {
    chai
      .request(server)
      .post('/api/v1/users/login')
      .send({
        email: 'maurice@gmmail.com',
        password: 'ASqw1244'
      })
      .end((error, res) => {
        expect(res.status).to.be.equal(401);
        expect(res.body).to.have.deep.property('message', 'Password is not correct');
        done();
      });
  });
  it('should retrieve all users', (done) => {
    chai
      .request(server)
      .get('/api/v1/users/allusers')
      .set('Authorization', adminToken)
      .end((error, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.deep.property('message');
        done();
      });
  });
  it('Admin should create users', (done) => {
    chai
      .request(server)
      .post('/api/v1/users/signup')
      .set('Authorization', adminToken)
      .send({
        firstname: 'chris',
        lastname: 'habineza',
        email: 'habineza@gmail.com',
        username: 'habninezachris',
        password: 'ASqw12345'
      })
      .end((error, res) => {
        expect(res.status).to.be.equal(201);
        expect(res.body).to.have.deep.property('status');
        expect(res.body).to.have.deep.property('message');
        expect(res.body).to.have.deep.property('data');
        expect(res.body).to.have.deep.property('token');
        done();
      });
  });
  it('should throw an error when username or email already exists', (done) => {
    chai
      .request(server)
      .post('/api/v1/users/signup')
      .set('Authorization', adminToken)
      .send({
        firstname: 'chris',
        lastname: 'habineza',
        email: 'habineza@gmail.com',
        username: 'habninezachris',
        password: 'ASqw12345'
      })
      .end((error, res) => {
        expect(res.status).to.be.equal(409);
        expect(res.body).to.have.deep.property('status');
        expect(res.body).to.have.deep.property('message');
        done();
      });
  });
  it('should retrieve single user', (done) => {
    chai
      .request(server)
      .get('/api/v1/users/1')
      .set('x-access-token', adminToken)
      .end((error, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.deep.property('message');
        done();
      });
  });
  it('should delete single user with id 2', (done) => {
    chai
      .request(server)
      .delete('/api/v1/users/2')
      .set('x-access-token', adminToken)
      .end((error, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.deep.property('message', 'User with id 2 is successfully deleted');
        done();
      });
  });

  it('should return send email having reset password link', async () => {
    const req = {
      body: {
        email: 'userfour@gmail.com'
      }
    };
    const res = {
      status() { },
      send() { },
      json() { }
    };
    sinon.stub(res, 'status').returnsThis();
    sinon.stub(sendPasswordResetEmailHelper, 'sendEmail').returns(true);
    await UserController.requestPasswordReset(req, res);
    expect(res.status).to.have.been.calledWith(200);
  });
  it('should return send email having reset password link', (done) => {
    chai
      .request(server)
      .post('/api/v1/users/reset')
      .send({
        email: 'unexistingemail@gmail.com'
      })
      .end((error, res) => {
        expect(res.status).to.be.equal(400);
        expect(res.body).to.have.deep.property('message');
        done();
      });
  });
  it('should return error if no password provided', (done) => {
    const token = Helper.generateToken({
      email: 'userfour@gmail.com',
      role: 'normal',
    });
    chai
      .request(server)
      .patch(`/api/v1/users/reset/${token}`)
      .set('Accept', 'Application/JSON')
      .send({
        password: '',
        confirmPassword: '',
      })
      .end((error, res) => {
        expect(res.status).to.be.equal(400);
        expect(res.body).to.have.deep.property('message');
        done();
      });
  });
  it('should return error if a weak password provided', (done) => {
    const token = Helper.generateToken({
      email: 'userfour@gmail.com',
      role: 'normal',
    });
    chai
      .request(server)
      .patch(`/api/v1/users/reset/${token}`)
      .send({
        password: 'sss',
        confirmPassword: 'sss',
      })
      .end((error, res) => {
        expect(res.status).to.be.equal(400);
        expect(res.body).to.have.deep.property('message');
        done();
      });
  });
  it('should return error if a password do not match', (done) => {
    const token = Helper.generateToken({
      email: 'userfour@gmail.com',
      role: 'normal',
    });
    chai
      .request(server)
      .patch(`/api/v1/users/reset/${token}`)
      .send({
        password: 'ssssd',
        confirmPassword: 'sss',
      })
      .end((error, res) => {
        expect(res.status).to.be.equal(400);
        expect(res.body).to.have.deep.property('message', 'Passwords provided do not match');
        done();
      });
  });
  describe('/Signout feature', () => {
    it('should logout a user', (done) => {
      chai
        .request(server)
        .post('/api/v1/users/signout')
        .set('x-access-token', adminToken)
        .end((error, res) => {
          expect(res.status).to.be.equal(200);
          expect(res.body).to.have.deep.property('message', 'Successfully logged out.');
          done();
        });
    });

    it('should should return error if logged out user tries to access protected routes', (done) => {
      chai
        .request(server)
        .get('/api/v1/users/allusers')
        .set('x-access-token', adminToken)
        .end((error, res) => {
          expect(res.status).to.be.equal(401);
          expect(res.body).to.have.deep.property('message', 'You are logged out!');
          done();
        });
    });
    it('should throw an error when the role is not the admin', (done) => {
      chai
        .request(server)
        .get('/api/v1/users/allusers')
        .set('x-access-token', usertoken)
        .end((error, res) => {
          expect(res.status).to.be.equal(403);
          expect(res.body).to.have.deep.property('message');
          done();
        });
    });
    it('should throw an error when token is not verified', (done) => {
      chai
        .request(server)
        .get('/api/v1/users/allusers')
        .set('x-access-token', `21${usertoken}`)
        .end((error, res) => {
          expect(res.status).to.be.equal(401);
          expect(res.body).to.have.deep.property('message');
          done();
        });
    });

    it('should not verify an email', (done) => {
      chai
        .request(server)
        .get(`/api/v1/users/verify?token=${'aaa'}`)
        .end((error, res) => {
          expect(res.status).to.be.equal(400);
          expect(res.body).to.have.deep.property('message', 'invalid request');
          done();
        });
    });

    it('should verify an email', (done) => {
      chai
        .request(server)
        .get(`/api/v1/users/verify?token=${userTwoToken}`)
        .end((error, res) => {
          expect(res.status).to.be.equal(200);
          expect(res.body).to.have.deep.property('message', 'You have been verified.');
          done();
        });
    });
  });
});
