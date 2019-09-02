
import { server, expect, chai } from './test-setup';

describe('Social login tests', () => {
  describe('Existing social user should be able to login', () => {
    before((done) => {
      process.env.facebook = 'facebook_existing';
      process.env.google = 'google_existing';
      process.env.twitter = 'twitter_existing';
      done();
    });

    it('should...with facebook', (done) => {
      chai.request(server)
        .get('/login/facebook')
        .end((err, res) => {
          if (err) { done(err); }
          expect(res.status).to.be.equal(200);
          expect(res.body).to.have.property('token');
          expect(res.body).to.have.deep.property('message', 'Logged in successfully');
          done();
        });
    });
    it('should...with google', (done) => {
      chai.request(server)
        .get('/login/google')
        .end((err, res) => {
          if (err) { done(err); }
          expect(res.status).to.be.equal(200);
          expect(res.body).to.have.property('token');
          expect(res.body).to.have.deep.property('message', 'Logged in successfully');
          done();
        });
    });
    it('should...with twitter', (done) => {
      chai.request(server)
        .get('/login/twitter')
        .end((err, res) => {
          if (err) { done(err); }
          expect(res.status).to.be.equal(200);
          expect(res.body).to.have.property('token');
          expect(res.body).to.have.deep.property('message', 'Logged in successfully');
          done();
        });
    });
  });

  describe('New social be registered if consents', () => {
    before((done) => {
      process.env.facebook = 'facebook_new';
      process.env.google = 'google_new';
      process.env.twitter = 'twitter_new';
      done();
    });
    it('should notify of none existent of account', (done) => {
      chai.request(server)
        .get('/login/facebook')
        .end((err, res) => {
          if (err) { done(err); }
          expect(res.status).to.be.equal(200);
          expect(res.body.message).to.contain('account created');
          done();
        });
    });
  });
});

export default server;
