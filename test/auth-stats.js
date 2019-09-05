import { chai, expect, server } from './test-setup';

let token;
describe('Test user stats', () => {
  before((done) => {
    chai.request(server)
      .post('/api/v1/users/login')
      .send({ email: 'admin@gmail.com', password: 'ASqw12345' })
      .end((error, res) => {
        token = `Bearer ${res.body.token}`;
        done();
      });
  });
  describe('test getting stats', () => {
    it('should return correct response if none', (done) => {
      chai.request(server)
        .get('/api/v1/users/stats')
        .set('Authorization', token)
        .end((err, res) => {
          console.log('<---------------------------');
          console.log(res.body);
          console.log('<---------------------------');
          expect(res.status).to.be.equal(404);
          expect(res.body.message).to.include('not found');
          done();
        });
    });
    it('should return correct response if user not logged in', (done) => {
      chai.request(server)
        .get('/api/v1/users/stats')
        .end((err, res) => {
          expect(res.status).to.be.equal(400);
          expect(res.body.message).to.include('not logged in');
          done();
        });
    });
  });
  describe('test stats gathering', () => {
    it('should not populate stats if user unauthenticated', (done) => {
      chai.request(server)
        .get('/api/v1/articles/fakeslug2')
        .end(() => {
          chai.request(server)
            .get('/api/v1/users/stats')
            .set('Authorization', token)
            .end((err, res) => {
              expect(res.status).to.be.equal(404);
              expect(res.body.message).to.include('not found');
              done();
            });
        });
    });
    it('should log every read', (done) => {
      chai.request(server)
        .get('/api/v1/articles/fakeslug2')
        .set('Authorization', token)
        .end(() => {
          chai.request(server)
            .get('/api/v1/users/stats')
            .set('Authorization', token)
            .end((err, res) => {
              expect(res.status).to.be.equal(200);
              expect(res.body).to.have.deep.property('message', 'your reading stats');
              expect(res.body.data).to.be.a('Array');
              done();
            });
        });
    });
  });
});
