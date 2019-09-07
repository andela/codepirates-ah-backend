import { chai, server, expect } from './test-setup';


let usertoken;
describe('test for favoriting and unfavoriting an article', () => {
  it('should signin user to favorite an article', (done) => {
    chai
      .request(server)
      .post('/api/v1/users/login')
      .send({
        email: 'user@gmail.com',
        password: 'ASqw12345'
      })
      .set('Accept', 'Application/JSON')
      .end((error, res) => {
        usertoken = `Bearer ${res.body.token}`;
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.property('token');
        done();
      });
  });
  it('test for favoriting an article', (done) => {
    chai.request(server)
      .post('/api/v1/articles/1/favorite')
      .send({})
      .set('Authorization', usertoken)
      .end((error, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.contain('Article favorited successfully');
        done();
      });
  });
  it('test for unfavoriting an article', (done) => {
    chai.request(server)
      .post('/api/v1/articles/1/favorite')
      .send({})
      .set('Authorization', usertoken)
      .end((error, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.contain('Favorite removed successfully');
        done();
      });
  });
  it('test for a wrong articleId', (done) => {
    chai.request(server)
      .post('/api/v1/articles/1xx/favorite')
      .send({})
      .set('Authorization', usertoken)
      .end((error, res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.contain('articleId must be a non negative integer');
        done();
      });
  });
  it('Article to be favorited not found', (done) => {
    chai.request(server)
      .post('/api/v1/articles/999/favorite')
      .send({})
      .set('Authorization', usertoken)
      .end((error, res) => {
        expect(res.status).to.equal(404);
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.contain('error');
        expect(res.body.message).to.contain('Article not found');
        done();
      });
  });
});
