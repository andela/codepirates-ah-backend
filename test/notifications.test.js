import { chai, server, expect } from './test-setup';


let usertoken;
describe('test for opting in and out of notifications', () => {
  it('should signin user to opt in for notifications', (done) => {
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
  it('test for user opting in for email notifications', (done) => {
    chai.request(server)
      .patch('/api/v1/notifications/email')
      .send({})
      .set('Authorization', usertoken)
      .end((error, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.contain('You have successfully subscribed to our email notifications');
        done();
      });
  });
  it('test for user opting in for in-app notifications', (done) => {
    chai.request(server)
      .patch('/api/v1/notifications/inApp')
      .send({})
      .set('Authorization', usertoken)
      .end((error, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.contain('You have successfully subscribed to in app notifications');
        done();
      });
  });
  it('test for user opting out of email notifications', (done) => {
    chai.request(server)
      .patch('/api/v1/notifications/email')
      .send({})
      .set('Authorization', usertoken)
      .end((error, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.contain('You will no longer receive email notifications from us');
        done();
      });
  });
  it('test for user opting out of in-app notifications', (done) => {
    chai.request(server)
      .patch('/api/v1/notifications/inApp')
      .send({})
      .set('Authorization', usertoken)
      .end((error, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.contain('You will no longer receive in-app notifications from us');
        done();
      });
  });
  it('test for getting user notifications', (done) => {
    chai.request(server)
      .get('/api/v1/notifications/')
      .set('Authorization', usertoken)
      .end((error, res) => {
        expect(res.status).to.equal(404);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.contain('You currently do not have notifications');
        done();
      });
  });
});
