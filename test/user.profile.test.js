import { chai, server, expect } from './test-setup';

let usertoken;

describe('/Create Profile feature', () => {
  it('should login', (done) => {
    chai
      .request(server)
      .post('/api/v1/users/login')
      .send({
        email: 'user@gmail.com',
        password: 'ASqw12345'
      })
      .end((error, res) => {
        if (error) done(error);
        usertoken = `Bearer ${res.body.token}`;
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.deep.property('message');
        done();
      });
  });

  it('should not update the profile when the username updated is not a string', (done) => {
    chai
      .request(server)
      .put('/api/v1/profile')
      .set('Authorization', usertoken)
      .send({
        bio: 'j is demonstrating this Bio',
        username: 123454
      })
      .end((error, res) => {
        if (error) done(error);
        expect(res).to.be.an('object');
        expect(res.status).to.equal(400);
        expect(res.body)
          .to.have.property('message')
          .to.be.a('string');
        done();
      });
  });

  it('should throw an error when user not authenticated ', (done) => {
    chai
      .request(server)
      .put('/api/v1/profile')
      .set('x-access-token', `21${usertoken}`)
      .end((error, res) => {
        if (error) done(error);
        expect(res.status).to.be.equal(401);
        expect(res.body).to.have.deep.property('message');
        done();
      });
  });

  it('Should successfully retrieve user profile', (done) => {
    chai
      .request(server)
      .get('/api/v1/profile/admin')
      .set('x-access-token', usertoken)
      .end((error, res) => {
        if (error) done(error);
        expect(res).have.status(200);
        expect(res).to.be.an('object');
        expect(res.body).to.have.keys('message', 'status', 'data');
        expect(res.body.message).to.deep.equal('Successfully retrieved a user profile');
        expect(res.body.data).to.have.keys('username', 'bio', 'image');
        done();
      });
  });
  it('should not update profile when username is taken', (done) => {
    chai
      .request(server)
      .put('/api/v1/profile')
      .set('Authorization', usertoken)
      .field('bio', 'I am a software developer based in kigali, i like data science and AI')
      .field('username', 'admin')
      .end((error, res) => {
        if (error) done(error);
        expect(res).to.be.an('object');
        expect(res.status).to.equal(409);
        expect(res.body.message).to.deep.equal(
          'Sorry! The profile username taken, try another one'
        );
        done();
      });
  });

  it('should not update profile when there  is invalid username', (done) => {
    chai
      .request(server)
      .put('/api/v1/profile')
      .set('Authorization', usertoken)
      .field('bio', 'I am a software developer based in kigali, i like data science and AI')
      .field('username', 12333)
      .end((error, res) => {
        expect(res).to.be.an('object');
        expect(res.status).to.equal(400);
        expect(res.body).to.have.keys('status', 'message');
        expect(res.body.status).to.deep.equal('error');
        done();
      });
  });

  it('should not update profile when there  is invalid bio', (done) => {
    chai
      .request(server)
      .put('/api/v1/profile')
      .set('Authorization', usertoken)
      .field('bio', 'I am ')
      .field('username', 'salviosage')
      .end((error, res) => {
        expect(res).to.be.an('object');
        expect(res.status).to.equal(400);
        expect(res.body).to.have.keys('status', 'message');
        expect(res.body.status).to.deep.equal('error');
        done();
      });
  });

  it('should update the profile', (done) => {
    chai
      .request(server)
      .put('/api/v1/profile')
      .set('Authorization', usertoken)
      .field('bio', 'I am a software developer based in kigali, i like data science and AI')
      .field('username', 'salvi')
      .end((error, res) => {
        if (error) done(error);
        expect(res).to.be.an('object');
        expect(res.status).to.equal(200);
        expect(res.body.data).to.have.property('bio');
        expect(res.body.data).to.have.property('image');
        done();
      });
  });

  it('Should not retrieve user profile when there is none', (done) => {
    chai
      .request(server)
      .get('/api/v1/profile/mikki')
      .set('Authorization', usertoken)
      .end((error, res) => {
        if (error) done(error);
        expect(res).have.status(404);
        expect(res).to.be.an('object');
        expect(res.body).to.have.keys('message', 'status');
        expect(res.body.message).to.deep.equal('Profile not found');
        done();
      });
  });
  it('Should successfully get all profiles of all authors', (done) => {
    chai
      .request(server)
      .get('/api/v1/profile/authors')
      .set('x-access-token', usertoken)
      .end((error, res) => {
        if (error) done(error);
        expect(res).have.status(200);
        expect(res).to.be.an('object');
        expect(res.body).to.have.keys('message', 'status', 'data');
        expect(res.body.message).to.deep.equal("The list of users' profiles.");
        done();
      });
  });
});
