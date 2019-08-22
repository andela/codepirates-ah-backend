import { chai, server, expect } from './test-setup';

let usertoken;
describe('test for following and unfollowing a user', () => {
  it('should sign in the follower', (done) => {
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

  it('test for following a user', (done) => {
    chai.request(server)
      .post('/api/v1/users/profiles/2/follow')
      .send({})
      .set('Authorization', usertoken)
      .end((error, res) => {
        console.log(res);
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.contain('You are now following');
        done();
      });
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
      .post('/api/v1/users/profiles/2/follow')
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
});
