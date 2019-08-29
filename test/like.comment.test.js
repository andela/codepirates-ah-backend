import { chai, server, expect } from './test-setup';

let adminToken;
let userToken;
describe('Like comment', () => {
  before('Login User', (done) => {
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
      });
    chai
      .request(server)
      .post('/api/v1/users/login')
      .send({
        email: 'user@gmail.com',
        password: 'ASqw12345'
      })
      .set('Accept', 'Application/JSON')
      .end((error, res) => {
        userToken = `Bearer ${res.body.token}`;
        done();
      });
  });
  describe('GET likes of a comment', () => {
    it('should be able to get likes of a comment when logged in', (done) => {
      chai
        .request(server)
        .get('/api/v1/comments/like/1')
        .set('Authorization', userToken)
        .set('Accept', 'Application/JSON')
        .end((error, res) => {
          expect(res.status).to.be.equal(200);
          expect(res.body).to.have.deep.property('message');
          done();
        });
    });
    it('should be able to get likes of a comment', (done) => {
      chai
        .request(server)
        .get('/api/v1/comments/like/2')
        .set('Authorization', userToken)
        .set('Accept', 'Application/JSON')
        .end((error, res) => {
          expect(res.status).to.be.equal(200);
          expect(res.body).to.have.deep.property('message');
          done();
        });
    });
    it('should return error if comment does not exist', (done) => {
      chai
        .request(server)
        .get('/api/v1/comments/like/9999')
        .set('Authorization', userToken)
        .set('Accept', 'Application/JSON')
        .end((error, res) => {
          expect(res.status).to.be.equal(404);
          expect(res.body).to.have.deep.property('message', 'Comment with id: 9999 does not exist.');
          done();
        });
    });
  });
  describe('POST likes of a comment', () => {
    it('should return error if comment does not exist', (done) => {
      chai
        .request(server)
        .post('/api/v1/comments/like/9999')
        .set('Authorization', userToken)
        .set('Accept', 'Application/JSON')
        .end((error, res) => {
          expect(res.status).to.be.equal(404);
          expect(res.body).to.have.deep.property('message', 'Comment with id: 9999 does not exist.');
          done();
        });
    });
    it('user should be able to like specific comment', (done) => {
      chai
        .request(server)
        .post('/api/v1/comments/like/3')
        .set('Authorization', userToken)
        .set('Accept', 'Application/JSON')
        .end((error, res) => {
          expect(res.status).to.be.equal(201);
          expect(res.body).to.have.deep.property('message');
          done();
        });
    });
    it('user should be not able to like specific comment twice', (done) => {
      chai
        .request(server)
        .post('/api/v1/comments/like/3')
        .set('Authorization', userToken)
        .set('Accept', 'Application/JSON')
        .end((error, res) => {
          expect(res.status).to.be.equal(400);
          expect(res.body).to.have.deep.property('message', 'You liked this comment already');
          done();
        });
    });
  });
  describe('PUT likes of a comment', () => {
    it('should return error if comment does not exist', (done) => {
      chai
        .request(server)
        .put('/api/v1/comments/like/9999')
        .set('Authorization', userToken)
        .set('Accept', 'Application/JSON')
        .end((error, res) => {
          expect(res.status).to.be.equal(404);
          expect(res.body).to.have.deep.property('message', 'Comment with id: 9999 does not exist.');
          done();
        });
    });
    it('user should be able to unlike specific comment', (done) => {
      chai
        .request(server)
        .put('/api/v1/comments/like/3')
        .set('Authorization', userToken)
        .set('Accept', 'Application/JSON')
        .end((error, res) => {
          expect(res.status).to.be.equal(200);
          expect(res.body).to.have.deep.property('message', 'You unliked this comment successfully');
          done();
        });
    });
    it('user should be able to unlike specific comment', (done) => {
      chai
        .request(server)
        .put('/api/v1/comments/like/3')
        .set('Authorization', adminToken)
        .set('Accept', 'Application/JSON')
        .end((error, res) => {
          expect(res.status).to.be.equal(400);
          expect(res.body).to.have.deep.property('message', 'You did not like this comment before');
          done();
        });
    });
  });
});
