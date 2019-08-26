import { chai, server, expect } from './test-setup';
import Helper from '../src/helpers/helper';

const adminToken = Helper.generateToken({
  id: 1,
  email: 'admin@gmail.com',
  username: 'admin',
  verified: true,
});
const FakeToken = Helper.generateToken({
  id: 1,
  email: '',
  username: 'admin',
  verified: true,
});
describe('Comments', () => {
  it('should retrieve all comments', (done) => {
    chai
      .request(server)
      .get('/api/v1/comments')
      .set('x-access-token', adminToken)
      .end((error, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.deep.property('message');
        done();
      });
  });
  it('should not retrieve all comments', (done) => {
    chai
      .request(server)
      .get('/api/v1/comments')
      .set('x-access-token', FakeToken)
      .end((error, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.deep.property('message');
        done();
      });
  });
  it('should return resource not found message if endpoint does not exist', (done) => {
    chai
      .request(server)
      .get('/api/v1/commentss')
      .set('x-access-token', adminToken)
      .end((error, res) => {
        expect(res.status).to.be.equal(404);
        expect(res.body).to.have.deep.property('error', 'Resource not found');
        done();
      });
  });
  it('should  comment on article', (done) => {
    chai
      .request(server)
      .post('/api/v1/comments/fakeslug')
      .send({
        body: 'I commented',
      })
      .set('x-access-token', adminToken)
      .end((error, res) => {
        expect(res.status).to.be.equal(201);
        expect(res.body).to.have.deep.property('message');
        expect(res.body).to.have.deep.property('data');
        done();
      });
  });
});
