import { chai, server, expect } from './test-setup';

let adminToken;
describe('Users', () => {
  it('should return welcome to author\'s heaven', (done) => {
    chai.request(server)
      .get('/')
      .end((error, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.deep.property('data', 'Welcome to Authors Haven.');
        done();
      });
  });
  it('should return resource not found message if endpoint does not exist', (done) => {
    chai.request(server)
      .get('/ii')
      .end((error, res) => {
        expect(res.status).to.be.equal(404);
        expect(res.body).to.have.deep.property('error', 'Resource not found');
        done();
      });
  });
  it('should sign up', (done) => {
    chai.request(server)
      .post('/api/v1/users/signup')
      .send({
        firstname: 'nshuti',
        lastname: 'jonath',
        email: 'maurice@gmmail.com',
        username: 'maurice',
        password: 'ASqw12345'
      }).end((error, res) => {
        expect(res.status).to.be.equal(201);
        expect(res.body).to.have.deep.property('message');
        done();
      });
  });
  it('should sign up second user', (done) => {
    chai.request(server)
      .post('/api/v1/users/signup')
      .send({
        firstname: 'nshuti',
        lastname: 'jonath',
        email: 'eliee@gmmail.com',
        username: 'mauricee',
        password: 'ASqw12ee'
      }).end((error, res) => {
        expect(res.status).to.be.equal(201);
        expect(res.body).to.have.deep.property('message');
        done();
      });
  });
  it('should throw error when user exists', (done) => {
    chai.request(server)
      .post('/api/v1/users/signup')
      .send({
        firstname: 'nshuti',
        lastname: 'jonath',
        email: 'maurice@gmmail.com',
        username: 'maurice',
        password: 'ASqw12345'
      }).end((error, res) => {
        expect(res.status).to.be.equal(409);
        expect(res.body).to.have.deep.property('message', 'An account with this email already exists');
        done();
      });
  });
  it('should sign in the user', (done) => {
    chai.request(server)
      .post('/api/v1/users/login')
      .send({
        email: 'admin@gmail.com',
        password: 'ASqw12345'
      })
      .set('Accept', 'Application/JSON')
      .end((error, res) => {
        adminToken = `Bearer ${res.body.token}`;
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.deep.property('message', 'welcome  back admin');
        expect(res.body).to.have.deep.property('token');
        done();
      });
  });
  it('should not sign in the user when username is incorrect', (done) => {
    chai.request(server)
      .post('/api/v1/users/login')
      .send({
        email: 'admfin@gmail.com',
        password: 'ASqw12345'
      }).end((error, res) => {
        expect(res.status).to.be.equal(404);
        done();
      });
  });
  it('should throw an error when password is not correct', (done) => {
    chai.request(server)
      .post('/api/v1/users/login')
      .send({
        email: 'maurice@gmmail.com',
        password: 'ASqw1244'
      }).end((error, res) => {
        expect(res.status).to.be.equal(401);
        expect(res.body).to.have.deep.property('message', 'Password is not correct');
        done();
      });
  });
  it('should retrieve all users', (done) => {
    chai.request(server)
      .get('/api/v1/users/allusers')
      .set('x-access-token', adminToken)
      .end((error, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.deep.property('message');
        done();
      });
  });
  it('should retrieve single user', (done) => {
    chai.request(server)
      .get('/api/v1/users/1')
      .set('x-access-token', adminToken)
      .end((error, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.deep.property('message');
        done();
      });
  });
  it('should delete single user with id 2', (done) => {
    chai.request(server)
      .delete('/api/v1/users/2')
      .set('x-access-token', adminToken)
      .end((error, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.deep.property('message', 'User with id 2 is successfully deleted');
        done();
      });
  });

  describe('/Signout feature', () => {
    it('should logout a user', (done) => {
      chai.request(server)
        .post('/api/v1/users/signout')
        .set('x-access-token', adminToken)
        .end((error, res) => {
          expect(res.status).to.be.equal(200);
          expect(res.body).to.have.deep.property('message', 'Successfully logged out.');
          done();
        });
    });

    it('should should return error if logged out user tries to access protected routes', (done) => {
      chai.request(server)
        .get('/api/v1/users/allusers')
        .set('x-access-token', adminToken)
        .end((error, res) => {
          expect(res.status).to.be.equal(401);
          expect(res.body).to.have.deep.property('message', 'You are logged out!');
          done();
        });
    });
  });
});
