import fs from 'fs';
import { chai, server, expect } from './test-setup';

let usertoken;
describe('/Create Profile feature', () => {
  it('should sign up', (done) => {
    chai
      .request(server)
      .post('/api/v1/users/signup')
      .send({
        firstname: 'jean',
        lastname: 'salvi',
        email: 'jeansalvi@gmail.com',
        username: 'salvi',
        password: 'ASqw12345'
      })
      .end((error, res) => {
        if (error) done(error);
        usertoken = `Bearer ${res.body.token}`;
        expect(res.status).to.be.equal(201);
        expect(res.body).to.have.deep.property('message');
        done();
      });
  });
  it('Create a profile for User ', (done) => {
    chai
      .request(server)
      .patch('/api/v1/users/Profile')
      .set('x-access-token', usertoken)
      .send({
        Bio: 'I am a software developer based in kigali, i like data science and AI',
        username: 'salvi',
      })
      .attach('image', fs.readFileSync('dummyData/avatar.jpg'), 'avatar.jpg')
      .end((error, res) => {
        if (error) done(error);
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.deep.property('message', 'Successfully Profile Updated.');
        done();
      });
  });
  it('should throw an error when user not authenticated ', (done) => {
    chai
      .request(server)
      .patch('/api/v1/users/profile')
      .set('x-access-token', `21${usertoken}`)
      .end((error, res) => {
        if (error) done(error);
        expect(res.status).to.be.equal(401);
        expect(res.body).to.have.deep.property('message');
        done();
      });
  });
  it('Should successfully retrieve user profile', (done) => {
    chai.request(server)
      .get('/api/v1/users/profile/salvi')
      .set('x-access-token', usertoken)
      .end((error, res) => {
        if (error) done(error);
        expect(res).have.status(200);
        expect(res).to.be.an('object');
        expect(res.body).to.have.keys('message', 'data');
        expect(res.body.message).to.deep.equal('successfully retrieved a user profile');
        expect(res.body.data).to.have.keys('userName', 'bio', 'image');
        done();
      });
  });

  it('should not update the profile when the username updated is not a string', (done) => {
    chai
      .request(server)
      .put('/api/v1/users/profile/salvi')
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
          .to.have.property('error')
          .to.be.a('string');
        done();
      });
  });

  it('Should not retrieve user profile when there is none', (done) => {
    chai.request(server)
      .get('/api/v1/users/profile/mikki')
      .end((error, res) => {
        if (error) done(error);
        expect(res).have.status(404);
        expect(res).to.be.an('object');
        expect(res.body).to.have.keys('message');
        expect(res.body.message).to.deep.equal('profile for mikki not found');
        done();
      });
  });

  it('should get an error when there is a wrong input profile name', (done) => {
    chai
      .request(server)
      .put('/api/v1/users/profile/mikki')
      .set('Authorization', usertoken)
      .end((error, res) => {
        if (error) done(error);
        expect(res).have.status(403);
        expect(res).to.be.an('object');
        expect(res.body).to.have.keys('error');
        expect(res.body.error).to.deep.equal('sorry! you can not edit the profile that is not yours');
        done();
      });
  });

  it('should not update the profile when the user aploads a file which is not an image', (done) => {
    chai
      .request(server)
      .put('/api/v1/users/profile/salvi')
      .set('Authorization', usertoken)
      .send({
        username: 'salviosage',
      })
      .attach('image', fs.readFileSync('dummyData/wromg.js'), 'wrong.js')
      .end((error, res) => {
        if (error) done(error);
        expect(res).to.be.an('object');
        expect(res.status).to.equal(400);
        expect(res.body)
          .to.have.property('error')
          .to.be.a('string');
        done();
      });
  });

  it('should update the profile', (done) => {
    chai
      .request(server)
      .put('/api/v1/users/profile/salvi')
      .set('Authorization', usertoken)
      .send({
        bio: 'jean is a software developer with a demonstrated history of software engineering',
        username: 'salvi'
      })
      .attach('image', fs.readFileSync('dummyData/avatar.jpg'), 'avatar.jpg')
      .end((error, res) => {
        if (error) done(error);
        expect(res).to.be.an('object');
        expect(res.status).to.equal(200);
        expect(res.body.data)
          .to.have.property('bio');
        expect(res.body.data)
          .to.have.property('image');
        expect(res.body.data.password).to.be.equal(undefined);
        done();
      });
  });
});
