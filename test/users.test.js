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
        password: 'ASqw12'
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
        password: 'ASqw12'
      }).end((error, res) => {
        expect(res.status).to.be.equal(404);
        expect(res.body).to.have.deep.property('message', 'Cannot register User with the id maurice@gmmail.com which is already in use');
        done();
      });
  });
  it('should sign in the user', (done) => {
    chai.request(server)
      .post('/api/v1/users/login')
      .send({
        email: 'admin@gmail.com',
        password: 'ASqw12'
      }).end((error, res) => {
        console.log(res.body);
        expect(res.status).to.be.equal(200);
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
      .set('')
      .end((error, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.deep.property('message',);
        done();
      });
  });
});
