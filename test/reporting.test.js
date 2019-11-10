import sinon from 'sinon';
import { chai, server, expect } from './test-setup';
import reportCtrl from '../src/controllers/report.comtroller';

let usertoken, admintoken, usertwotoken;

describe('/Report an article', () => {
  it('should login first user', (done) => {
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
        admintoken = `Bearer ${res.body.token}`;
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.deep.property('message');
        done();
      });
  });

  it('should not report an article when there is no reason provided', (done) => {
    chai
      .request(server)
      .post('/api/v1/reports/fakeslug')
      .set('Authorization', usertoken)
      .end((error, res) => {
        expect(res).to.be.an('object');
        expect(res.status).to.equal(400);
        expect(res.body).to.have.keys('message', 'status');
        expect(res.body.message).to.deep.equal('reason is required');
        done();
      });
  });
  it('should not report an article when reason is not valid', (done) => {
    chai
      .request(server)
      .post('/api/v1/reports/fakeslug')
      .set('Authorization', usertoken)
      .send({
        reason: 'however',
      })
      .end((error, res) => {
        expect(res).to.be.an('object');
        expect(res.status).to.equal(400);
        expect(res.body).to.have.keys('message', 'status');
        expect(res.body.message).to.deep.equal('reason must be one of [Rules Violation, Spam, Harassment]');
        done();
      });
  });
  it('should not report unexisting article ', (done) => {
    chai
      .request(server)
      .post('/api/v1/reports/fakeslugg')
      .set('Authorization', usertoken)
      .send({
        reason: 'Spam',
      })
      .end((error, res) => {
        expect(res).to.be.an('object');
        expect(res.status).to.equal(404);
        expect(res.body).to.have.keys('message', 'status');
        expect(res.body.message).to.deep.equal('post not found');
        done();
      });
  });
  it('should not report his/her article ', (done) => {
    chai
      .request(server)
      .post('/api/v1/reports/fakeslug')
      .set('Authorization', admintoken)
      .send({
        reason: 'Spam',
      })
      .end((error, res) => {
        expect(res).to.be.an('object');
        expect(res.status).to.equal(403);
        expect(res.body).to.have.keys('message', 'status');
        expect(res.body.message).to.deep.equal('Sorry you can not report your article.');
        done();
      });
  });
  it('user should se there is no report he made yet', (done) => {
    chai
      .request(server)
      .get('/api/v1/reports')
      .set('Authorization', admintoken)
      .end((error, res) => {
        expect(res).to.be.an('object');
        expect(res.status).to.equal(404);
        expect(res.body).to.have.keys('message', 'status');
        expect(res.body.message).to.deep.equal('No reports found');
        done();
      });
  });
  it('should report an article ', (done) => {
    chai
      .request(server)
      .post('/api/v1/reports/fakeslug')
      .set('Authorization', usertoken)
      .send({
        reason: 'Spam',
      })
      .end((error, res) => {
        expect(res).to.be.an('object');
        expect(res.status).to.equal(200);
        expect(res.body).to.have.keys('message', 'status', 'data');
        expect(res.body.message).to.deep.equal('Article Successfully reported');
        expect(res.body.data).to.have.keys('articleSlug', 'reason', 'id');
        done();
      });
  });
  it('should not report article he/she arleady reported ', (done) => {
    chai
      .request(server)
      .post('/api/v1/reports/fakeslug')
      .set('Authorization', usertoken)
      .send({
        reason: 'Rules Violation',
      })
      .end((error, res) => {
        expect(res).to.be.an('object');
        expect(res.status).to.equal(403);
        expect(res.body).to.have.keys('message', 'status');
        expect(res.body.message).to.deep.equal('You arleady Reported this article.');
        done();
      });
  });
  it('should  report another article ', (done) => {
    chai
      .request(server)
      .post('/api/v1/reports/fakeslug2')
      .set('Authorization', usertoken)
      .send({
        reason: 'Rules Violation',
      })
      .end((error, res) => {
        expect(res).to.be.an('object');
        expect(res.status).to.equal(200);
        expect(res.body).to.have.keys('message', 'status', 'data');
        expect(res.body.message).to.deep.equal('Article Successfully reported');
        expect(res.body.data).to.have.keys('articleSlug', 'reason', 'id');
        done();
      });
  });
  it('user should see all his/her report ', (done) => {
    chai
      .request(server)
      .get('/api/v1/reports/?page=2&&limit=5')
      .set('Authorization', usertoken)
      .end((error, res) => {
        expect(res).to.be.an('object');
        expect(res.status).to.equal(200);
        expect(res.body).to.have.keys('message', 'status', 'data');
        expect(res.body.message).to.deep.equal('Your reports retrieved successfully');
        expect(res.body.data).to.have.keys('count', 'yourReport');
        expect(res.body.data.count).to.deep.equal(2);
        done();
      });
  });
  it('second user should report article ', (done) => {
    chai
      .request(server)
      .post('/api/v1/reports/fakeslug2')
      .set('Authorization', usertwotoken)
      .send({
        reason: 'Rules Violation',
      })
      .end((error, res) => {
        expect(res).to.be.an('object');
        expect(res.status).to.equal(200);
        expect(res.body).to.have.keys('message', 'status', 'data');
        expect(res.body.message).to.deep.equal('Article Successfully reported');
        expect(res.body.data).to.have.keys('articleSlug', 'reason', 'id');
        done();
      });
  });
  it('admin should see the report for a pecific Article ', (done) => {
    chai
      .request(server)
      .get('/api/v1/reports/fakeslug2/?page=2&&limit=5')
      .set('Authorization', admintoken)
      .end((error, res) => {
        expect(res).to.be.an('object');
        expect(res.status).to.equal(200);
        expect(res.body).to.have.keys('message', 'status', 'data');
        expect(res.body.message).to.deep.equal('Reports retrieved successfully');
        expect(res.body.data).to.have.keys('count', 'reports');
        expect(res.body.data.count).to.deep.equal(2);
        done();
      });
  });
  it('admin or any user should not delete unexisting report ', (done) => {
    chai
      .request(server)
      .delete('/api/v1/reports/16')
      .set('Authorization', admintoken)
      .end((error, res) => {
        expect(res).to.be.an('object');
        expect(res.status).to.equal(404);
        expect(res.body).to.have.keys('message', 'status');
        expect(res.body.message).to.deep.equal('That report does not exist!');
        done();
      });
  });
  it('user should not delete the report which is not belong to her/him ', (done) => {
    chai
      .request(server)
      .delete('/api/v1/reports/1')
      .set('Authorization', usertwotoken)
      .end((error, res) => {
        expect(res).to.be.an('object');
        expect(res.status).to.equal(403);
        expect(res.body).to.have.keys('message', 'status');
        expect(res.body.message).to.deep.equal('Sorry you have no access to delete this Report.');
        done();
      });
  });
  it('user should delete his/her report ', (done) => {
    chai
      .request(server)
      .delete('/api/v1/reports/1')
      .set('Authorization', usertoken)
      .end((error, res) => {
        expect(res).to.be.an('object');
        expect(res.status).to.equal(200);
        expect(res.body).to.have.keys('message', 'status');
        expect(res.body.message).to.deep.equal('Report deleted succussfully!');
        done();
      });
  });
  it('admin should see that the article is not reported yet ', (done) => {
    chai
      .request(server)
      .get('/api/v1/reports/fakeslug')
      .set('Authorization', admintoken)
      .end((error, res) => {
        expect(res).to.be.an('object');
        expect(res.status).to.equal(404);
        expect(res.body).to.have.keys('message', 'status');
        expect(res.body.message).to.deep.equal('This article is not yet Reported');
        done();
      });
  });
  it('should throw a server error with getMyReport function', async () => {
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
    await reportCtrl.getMyReport(req, res);
    expect(res.status).to.have.been.calledWith(500);
  });
  it('should throw a server error with getreportForArticle function', async () => {
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
    await reportCtrl.getReportsForArticle(req, res);
    expect(res.status).to.have.been.calledWith(500);
  });
  it('should throw a server error with deleteReport function', async () => {
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
    await reportCtrl.deleteReport(req, res);
    expect(res.status).to.have.been.calledWith(500);
  });
  it('should throw a server error with reportArticle function', async () => {
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
    await reportCtrl.reportArticle(req, res);
    expect(res.status).to.have.been.calledWith(500);
  });
});
