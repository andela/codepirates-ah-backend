import sinon from 'sinon';
import 'dotenv/config';
import { chai, server, expect } from './test-setup';
import likeCtrl from '../src/controllers/likes.controller';

let usertoken, adminToken, mikeToken;

describe('/likes and dislikes  feature', () => {
  it('should login first user ', (done) => {
    chai
      .request(server)
      .post('/api/v1/users/login')
      .send({
        email: 'user@gmail.com',
        password: 'ASqw12345'
      })
      .end((error, res) => {
        usertoken = `Bearer ${res.body.token}`;
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.deep.property('message');
        done();
      });
  });
  it('should login second user ', (done) => {
    chai
      .request(server)
      .post('/api/v1/users/login')
      .send({
        email: 'usertwo@gmail.com',
        password: 'ASqw12345'
      })
      .end((error, res) => {
        mikeToken = `Bearer ${res.body.token}`;
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.deep.property('message');
        done();
      });
  });
  it('should login an admin', (done) => {
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

  it('should throw an error when user not authenticated ', (done) => {
    chai
      .request(server)
      .put('/api/v1/likes/clap/fakeslug')
      .set('x-access-token', `21${usertoken}`)
      .end((error, res) => {
        expect(res.status).to.be.equal(401);
        expect(res.body).to.have.deep.property('message');
        done();
      });
  });

  it('should not clap for your article', (done) => {
    chai
      .request(server)
      .put('/api/v1/likes/clap/fakeslug')
      .set('x-access-token', `${adminToken}`)
      .end((error, res) => {
        expect(res.status).to.be.equal(401);
        expect(res.body).to.have.deep.property('message');
        expect(res.body.message).to.deep.equal('You can not clap to your own post');
        done();
      });
  });
  it('should return not dislike your article ', (done) => {
    chai
      .request(server)
      .put('/api/v1/likes/dislike/fakeslug')
      .set('x-access-token', `${adminToken}`)
      .end((error, res) => {
        expect(res.status).to.be.equal(401);
        expect(res.body).to.have.deep.property('message');
        expect(res.body.message).to.deep.equal('You can not dislike to your own post');
        done();
      });
  });
  it('should not unlike the article you didnt like', (done) => {
    chai
      .request(server)
      .put('/api/v1/likes/unlike/fakeslug')
      .set('Authorization', usertoken)
      .end((error, res) => {
        expect(res).have.status(401);
        expect(res).to.be.an('object');
        expect(res.body).to.have.keys('message', 'status');
        expect(res.body.message).to.deep.equal('you cant unlike article you did not like');
        done();
      });
  });
  it('Should successfully clap for a certain article', (done) => {
    chai
      .request(server)
      .put('/api/v1/likes/clap/fakeslug')
      .set('x-access-token', usertoken)
      .end((error, res) => {
        expect(res).have.status(200);
        expect(res).to.be.an('object');
        expect(res.body).to.have.keys('message', 'status', 'data');
        expect(res.body.message).to.deep.equal('Successfully claped');
        expect(res.body.data).to.have.keys('ArticleSlug', 'status', 'claps');
        expect(res.body.data.claps).to.deep.equal(1);
        expect(res.body.data.status).to.deep.equal('like');
        done();
      });
  });

  it('Should successfully clap for a certain article second time', (done) => {
    chai
      .request(server)
      .put('/api/v1/likes/clap/fakeslug')
      .set('x-access-token', usertoken)
      .end((error, res) => {
        expect(res).have.status(200);
        expect(res).to.be.an('object');
        expect(res.body).to.have.keys('message', 'status', 'data');
        expect(res.body.message).to.deep.equal('Successfully claped');
        expect(res.body.data).to.have.keys('ArticleSlug', 'status', 'claps');
        expect(res.body.data.claps).to.deep.equal(2);
        expect(res.body.data.status).to.deep.equal('like');
        done();
      });
  });

  it('should unlike Article', (done) => {
    chai
      .request(server)
      .put('/api/v1/likes/unlike/fakeslug')
      .set('Authorization', usertoken)
      .end((error, res) => {
        expect(res).have.status(200);
        expect(res).to.be.an('object');
        expect(res.body).to.have.keys('message', 'status', 'data');
        expect(res.body.message).to.deep.equal('Successfully unliked');
        expect(res.body.data).to.have.keys('ArticleSlug', 'status', 'claps');
        expect(res.body.data.claps).to.deep.equal(0);
        expect(res.body.data.status).to.deep.equal('neutral');
        done();
      });
  });

  it('should dislike Article', (done) => {
    chai
      .request(server)
      .put('/api/v1/likes/dislike/fakeslug')
      .set('Authorization', usertoken)
      .end((error, res) => {
        expect(res).have.status(200);
        expect(res).to.be.an('object');
        expect(res.body).to.have.keys('message', 'status', 'data');
        expect(res.body.message).to.deep.equal('Successfully disliked');
        expect(res.body.data).to.have.keys('ArticleSlug', 'status', 'claps');
        expect(res.body.data.claps).to.deep.equal(0);
        expect(res.body.data.status).to.deep.equal('dislike');
        done();
      });
  });
  it('second user should dislike Article', (done) => {
    chai
      .request(server)
      .put('/api/v1/likes/dislike/fakeslug')
      .set('Authorization', mikeToken)
      .end((error, res) => {
        expect(res).have.status(200);
        expect(res).to.be.an('object');
        expect(res.body).to.have.keys('message', 'status', 'data');
        expect(res.body.message).to.deep.equal('Successfully disliked');
        expect(res.body.data).to.have.keys('ArticleSlug', 'status', 'claps');
        expect(res.body.data.claps).to.deep.equal(0);
        expect(res.body.data.status).to.deep.equal('dislike');
        done();
      });
  });
  it('should return all Dislike to a certain article ', (done) => {
    chai
      .request(server)
      .get('/api/v1/likes/dislikes/fakeslug')
      .set('Authorization', usertoken)
      .end((error, res) => {
        expect(res).have.status(200);
        expect(res).to.be.an('object');
        expect(res.body).to.have.keys('message', 'data', 'status');
        expect(res.body.message).to.deep.equal('Dislike retrieved successfully');
        expect(res.body.data).to.have.keys('dislikes');
        done();
      });
  });
  it('should Unlike Article due to user try to dislike secomd time ', (done) => {
    chai
      .request(server)
      .put('/api/v1/likes/dislike/fakeslug')
      .set('Authorization', usertoken)
      .end((error, res) => {
        expect(res).have.status(200);
        expect(res).to.be.an('object');
        expect(res.body).to.have.keys('message', 'status', 'data');
        expect(res.body.message).to.deep.equal('Successfully disliked');
        expect(res.body.data).to.have.keys('ArticleSlug', 'status', 'claps');
        expect(res.body.data.claps).to.deep.equal(0);
        expect(res.body.data.status).to.deep.equal('neutral');
        done();
      });
  });


  it('should not unlike unexisting article', (done) => {
    chai
      .request(server)
      .put('/api/v1/likes/unlike/fakesl')
      .set('Authorization', usertoken)
      .end((error, res) => {
        expect(res).have.status(404);
        expect(res).to.be.an('object');
        expect(res.body).to.have.keys('message', 'status');
        expect(res.body.message).to.deep.equal('post not found');
        done();
      });
  });
  it('Should successfully clap to atricle for second user  ', (done) => {
    chai
      .request(server)
      .put('/api/v1/likes/clap/fakeslug')
      .set('x-access-token', mikeToken)
      .end((error, res) => {
        expect(res).have.status(200);
        expect(res).to.be.an('object');
        expect(res.body).to.have.keys('message', 'status', 'data');
        expect(res.body.message).to.deep.equal('Successfully claped');
        expect(res.body.data).to.have.keys('ArticleSlug', 'status', 'claps');
        expect(res.body.data.claps).to.deep.equal(1);
        expect(res.body.data.status).to.deep.equal('like');
        done();
      });
  });
  it('Should successfully clap  for first user', (done) => {
    chai
      .request(server)
      .put('/api/v1/likes/clap/fakeslug')
      .set('x-access-token', usertoken)
      .end((error, res) => {
        expect(res).have.status(200);
        expect(res).to.be.an('object');
        expect(res.body).to.have.keys('message', 'status', 'data');
        expect(res.body.message).to.deep.equal('Successfully claped');
        expect(res.body.data).to.have.keys('ArticleSlug', 'status', 'claps');
        expect(res.body.data.claps).to.deep.equal(1);
        expect(res.body.data.status).to.deep.equal('like');
        done();
      });
  });
  it('Should successfully clap second time for first user', (done) => {
    chai
      .request(server)
      .put('/api/v1/likes/clap/fakeslug')
      .set('x-access-token', usertoken)
      .end((error, res) => {
        expect(res).have.status(200);
        expect(res).to.be.an('object');
        expect(res.body).to.have.keys('message', 'status', 'data');
        expect(res.body.message).to.deep.equal('Successfully claped');
        expect(res.body.data).to.have.keys('ArticleSlug', 'status', 'claps');
        expect(res.body.data.claps).to.deep.equal(2);
        expect(res.body.data.status).to.deep.equal('like');
        done();
      });
  });
  it('should return all claps to a certain article', (done) => {
    chai
      .request(server)
      .get('/api/v1/likes/claps/fakeslug')
      .set('Authorization', usertoken)
      .end((error, res) => {
        expect(res).have.status(200);
        expect(res).to.be.an('object');
        expect(res.body).to.have.keys('message', 'data', 'status');
        expect(res.body.message).to.deep.equal('Claps retrieved successfully');
        expect(res.body.data.clapers).to.deep.equal(2);
        done();
      });
  });
  it('should throw a server error with unlike function', async () => {
    const req = [
      { params: { Article: 'fakeslug' } },
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
    await likeCtrl.unlike(req, res);
    expect(res.status).to.have.been.calledWith(500);
  });
  it('should throw a server error with dislike function', async () => {
    const req = [
      { params: { Article: 'fakeslug' } },
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
    await likeCtrl.dislike(req, res);
    expect(res.status).to.have.been.calledWith(500);
  });
  it('should throw a server error with clap function', async () => {
    const req = [
      { params: { Article: 'fakeslug' } },
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
    await likeCtrl.clap(req, res);
    expect(res.status).to.have.been.calledWith(500);
  });
  it('should throw a server error with getDislikes function', async () => {
    const req = [
      { params: { Article: 'fakeslug' } },
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
    await likeCtrl.getDislikes(req, res);
    expect(res.status).to.have.been.calledWith(500);
  });
  it('should throw a server error with getclaps function', async () => {
    const req = [
      { params: { Article: 'fakeslug' } },
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
    await likeCtrl.getClaps(req, res);
    expect(res.status).to.have.been.calledWith(500);
  });
});
