import sinon from 'sinon';
import { chai, server, expect } from './test-setup';
import rateCtrl from '../src/controllers/rating.controller';

let adminToken, usertwotoken, userToken;

describe('/POST rate article', () => {
  it('should login first user', (done) => {
    chai
      .request(server)
      .post('/api/v1/users/login')
      .send({
        email: 'user@gmail.com',
        password: 'ASqw12345'
      })
      .end((error, res) => {
        userToken = `Bearer ${res.body.token}`;
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.deep.property('message');
        done();
      });
  });
  it('should login second user', (done) => {
    chai
      .request(server)
      .post('/api/v1/users/login')
      .send({
        email: 'usertwo@gmail.com',
        password: 'ASqw12345'
      })
      .end((error, res) => {
        usertwotoken = `Bearer ${res.body.token}`;
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.deep.property('message');
        done();
      });
  });
  it('should login admin', (done) => {
    chai
      .request(server)
      .post('/api/v1/users/login')
      .send({
        email: 'admin@gmail.com',
        password: 'ASqw12345'
      })
      .end((error, res) => {
        adminToken = `Bearer ${res.body.token}`;
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.deep.property('message');
        done();
      });
  });
  it('should return an error when there is no rate provided', (done) => {
    chai
      .request(server)
      .put('/api/v1/rate/fakeslug')
      .set('Authorization', userToken)
      .set('Accept', 'Application/JSON')
      .end((error, res) => {
        expect(res.status).to.be.equal(400);
        expect(res.body).to.have.keys('message', 'status');
        expect(res.body).to.have.deep.property('message', 'rate is required');
        done();
      });
  });
  it('ahould return an erro message when rate is not nbr btn 1-5', (done) => {
    chai
      .request(server)
      .put('/api/v1/rate/fakeslug')
      .set('Authorization', userToken)
      .send({
        rate: 10
      })
      .set('Accept', 'Application/JSON')
      .end((error, res) => {
        expect(res.status).to.be.equal(400);
        expect(res.body).to.have.keys('message', 'status');
        expect(res.body).to.have.deep.property('message', 'rate must be less than or equal to 5');
        done();
      });
  });
  it('ahould return an erro message when rate is not nbr btn 1-5', (done) => {
    chai
      .request(server)
      .put('/api/v1/rate/fakeslug')
      .set('Authorization', userToken)
      .send({
        rate: 0
      })
      .set('Accept', 'Application/JSON')
      .end((error, res) => {
        expect(res.status).to.be.equal(400);
        expect(res.body).to.have.keys('message', 'status');
        expect(res.body).to.have.deep.property('message', 'rate must be larger than or equal to 1');
        done();
      });
  });
  it('should return error when article is not found', (done) => {
    chai
      .request(server)
      .put('/api/v1/rate/fakeslu')
      .set('Authorization', userToken)
      .send({
        rate: 1
      })
      .set('Accept', 'Application/JSON')
      .end((error, res) => {
        expect(res.status).to.be.equal(404);
        expect(res.body).to.have.keys('message', 'status');
        expect(res.body).to.have.deep.property('message', 'post not found');
        done();
      });
  });
  it('should return error when user try to get rate for article which is not there', (done) => {
    chai
      .request(server)
      .get('/api/v1/rate/fakeslu')
      .set('Authorization', userToken)
      .send({
        rate: 1
      })
      .set('Accept', 'Application/JSON')
      .end((error, res) => {
        expect(res.status).to.be.equal(404);
        expect(res.body).to.have.keys('message', 'status');
        expect(res.body).to.have.deep.property('message', 'post not found');
        done();
      });
  });
  it('should return error message when there is no rate yet made', (done) => {
    chai
      .request(server)
      .get('/api/v1/rate')
      .set('Authorization', adminToken)
      .send({
        rate: 1
      })
      .set('Accept', 'Application/JSON')
      .end((error, res) => {
        expect(res.status).to.be.equal(404);
        expect(res.body).to.have.keys('message', 'status');
        expect(res.body).to.have.deep.property('message', 'no rate yet made');
        done();
      });
  });
  it('should return error message when there is no rate for a certain article yet', (done) => {
    chai
      .request(server)
      .get('/api/v1/rate/fakeslug')
      .set('Authorization', userToken)
      .send({
        rate: 1
      })
      .set('Accept', 'Application/JSON')
      .end((error, res) => {
        expect(res.status).to.be.equal(404);
        expect(res.body).to.have.keys('message', 'status');
        expect(res.body).to.have.deep.property('message', 'Article with slug fakeslug not yet Rated');
        done();
      });
  });
  it('should return error when user try to rate his or her article', (done) => {
    chai
      .request(server)
      .put('/api/v1/rate/fakeslug')
      .set('Authorization', adminToken)
      .send({
        rate: 4
      })
      .set('Accept', 'Application/JSON')
      .end((error, res) => {
        expect(res.status).to.be.equal(400);
        expect(res.body).to.have.keys('message', 'status');
        expect(res.body).to.have.deep.property('message', 'You cannot rate your own article');
        done();
      });
  });
  it('should rate an article', (done) => {
    chai
      .request(server)
      .put('/api/v1/rate/fakeslug')
      .set('Authorization', userToken)
      .send({
        rate: 4
      })
      .set('Accept', 'Application/JSON')
      .end((error, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.keys('message', 'status', 'data');
        expect(res.body).to.have.deep.property('message', 'Successfully rated');
        done();
      });
  });
  it('should update rate for an article', (done) => {
    chai
      .request(server)
      .put('/api/v1/rate/fakeslug')
      .set('Authorization', userToken)
      .send({
        rate: 3
      })
      .set('Accept', 'Application/JSON')
      .end((error, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.keys('message', 'status', 'data');
        expect(res.body).to.have.deep.property('message', 'Successfully rated');
        done();
      });
  });
  it('user two should rate an article', (done) => {
    chai
      .request(server)
      .put('/api/v1/rate/fakeslug')
      .set('Authorization', usertwotoken)
      .send({
        rate: 1
      })
      .set('Accept', 'Application/JSON')
      .end((error, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.keys('message', 'status', 'data');
        expect(res.body).to.have.deep.property('message', 'Successfully rated');
        done();
      });
  });
  it('should return rates for article and average rate for that article', (done) => {
    chai
      .request(server)
      .get('/api/v1/rate/fakeslug/?page=2&&limit=5')
      .set('Authorization', userToken)
      .set('Accept', 'Application/JSON')
      .end((error, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.keys('message', 'status', 'data');
        expect(res.body.data).to.have.keys('rating', 'count', 'data');
        expect(res.body).to.have.deep.property('message', 'Rating for article with slug fakeslug found');
        done();
      });
  });

  it('admin should return all rates and pagination for rates', (done) => {
    chai
      .request(server)
      .get('/api/v1/rate/?page=2&&limit=5')
      .set('Authorization', adminToken)
      .send({
        rate: 1
      })
      .set('Accept', 'Application/JSON')
      .end((error, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.keys('message', 'status', 'data');
        expect(res.body).to.have.deep.property('message', 'all rates retrieved successfully');
        done();
      });
  });
  it('should throw a server error with createOrUpdateRate function', async () => {
    const req = [
      { params: { articleSlug: 'fakeslug' } },
      {
        auth: {
          email: 'userthree@gmail.com'
        }
      }
    ];
    const res = {
      status() { },
      send() { },
      json() { }
    };
    sinon.stub(res, 'status').returnsThis();
    await rateCtrl.createOrUpdateRate(req, res);
    expect(res.status).to.have.been.calledWith(500);
  });
  it('should throw a server error with getArticleRating function', async () => {
    const req = [
      { params: { articleSlug: 'fakeslug' } },
      {
        auth: {
          email: 'userthree@gmail.com'
        }
      }
    ];
    const res = {
      status() { },
      send() { },
      json() { }
    };
    sinon.stub(res, 'status').returnsThis();
    await rateCtrl.getArticleRating(req, res);
    expect(res.status).to.have.been.calledWith(500);
  });
});
