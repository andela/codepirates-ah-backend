import { chai, server, expect } from './test-setup';


describe('test register user validations', () => {
  it('test for valid inputs', (done) => {
    chai.request(server)
      .post('/api/v1/users/signup')
      .send({
        firstname: 'Noah',
        lastname: 'Kalyesubula',
        username: 'knoah',
        email: 'noah.kalyesubula@andela.com',
        password: 'Noah2019'
      })
      .end((error, res) => {
        expect(res.status).to.equal(201);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('data');
        expect(res.body).to.have.deep.property('message', 'Your account has been successfully created. An email has been sent to you with detailed instructions on how to activate it.');
        done();
      });
  });
  it('test for existing email', (done) => {
    chai.request(server)
      .post('/api/v1/users/signup')
      .send({
        firstname: 'Noah',
        lastname: 'Kalyesubula',
        username: 'knoah',
        email: 'noah.kalyesubula@andela.com',
        password: 'Noah2019'
      })
      .end((error, res) => {
        expect(res.status).to.equal(409);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.deep.property('message', 'An account with this email already exists');
        done();
      });
  });
  it('test for an invalid email', (done) => {
    chai.request(server)
      .post('/api/v1/users/signup')
      .send({
        firstname: 'Noah',
        lastname: 'Kalyesubula',
        username: 'knoah',
        email: 'n',
        password: 'Noah2019'
      })
      .end((error, res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.deep.property('message', 'Email is not valid');
        done();
      });
  });
  it('test for missing email', (done) => {
    chai.request(server)
      .post('/api/v1/users/signup')
      .send({
        firstname: 'Noah',
        lastname: 'Kalyesubula',
        username: 'knoah',
        email: '',
        password: 'Noah2019'
      })
      .end((error, res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.deep.property('message', 'No email was specified');
        done();
      });
  });
  it('test for missing key email in the request', (done) => {
    chai.request(server)
      .post('/api/v1/users/signup')
      .send({
        firstname: 'Noah',
        lastname: 'Kalyesubula',
        username: 'knoah',
        password: 'Noah2019'
      })
      .end((error, res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.deep.property('message', 'No email was specified');
        done();
      });
  });
  it('test for a non aphanumeric password', (done) => {
    chai.request(server)
      .post('/api/v1/users/signup')
      .send({
        firstname: 'Noah',
        lastname: 'Kalyesubula',
        username: 'knoah',
        email: 'noah.kalyesubula@andela.com',
        password: '20192019'
      })
      .end((error, res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.deep.property('message', 'Password should be Alphanumeric');
        done();
      });
  });
  it('test for a less than 8 character password', (done) => {
    chai.request(server)
      .post('/api/v1/users/signup')
      .send({
        firstname: 'Noah',
        lastname: 'Kalyesubula',
        username: 'knoah',
        email: 'noah.kalyesubula@andela.com',
        password: 'Noah5'
      })
      .end((error, res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.deep.property('message', 'Password length must be at least 8 characters long');
        done();
      });
  });
  it('test for missing key password in the request', (done) => {
    chai.request(server)
      .post('/api/v1/users/signup')
      .send({
        firstname: 'Noah',
        lastname: 'Kalyesubula',
        username: 'knoah',
        email: 'noah.kalyesubula@andela.com'
      })
      .end((error, res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.deep.property('message', 'No password was specified');
        done();
      });
  });
  it('test for invalid firstname', (done) => {
    chai.request(server)
      .post('/api/v1/users/signup')
      .send({
        firstname: 'Noah2',
        lastname: 'Kalyesubula',
        username: 'knoah',
        email: 'noah.kalyesubula@andela.com',
        password: 'Noah2019'
      })
      .end((error, res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.deep.property('message', 'firstname should contain only characters');
        done();
      });
  });
  it('test for missing firstname', (done) => {
    chai.request(server)
      .post('/api/v1/users/signup')
      .send({
        firstname: '',
        lastname: 'Kalyesubula',
        username: 'knoah',
        email: 'noah.kalyesubula@andela.com',
        password: 'Noah2019'
      })
      .end((error, res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.deep.property('message', 'No firstname was specified');
        done();
      });
  });
  it('test for missing key firstname in the request', (done) => {
    chai.request(server)
      .post('/api/v1/users/signup')
      .send({
        lastname: 'Kalyesubula',
        username: 'knoah',
        email: 'noah.kalyesubula@andela.com',
        password: 'Noah2019'
      })
      .end((error, res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.deep.property('message', 'No firstname was specified');
        done();
      });
  });
  it('test for invalid lastname', (done) => {
    chai.request(server)
      .post('/api/v1/users/signup')
      .send({
        firstname: 'Noah',
        lastname: 'Kalyesubula5',
        username: 'knoah',
        email: 'noah.kalyesubula@andela.com',
        password: 'Noah2019'
      })
      .end((error, res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.deep.property('message', 'lastname should contain only characters');
        done();
      });
  });
  it('test for missing lastname', (done) => {
    chai.request(server)
      .post('/api/v1/users/signup')
      .send({
        firstname: 'Noah',
        lastname: '',
        username: 'knoah',
        email: 'noah.kalyesubula@andela.com',
        password: 'Noah2019'
      })
      .end((error, res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.deep.property('message', 'No lastname was specified');
        done();
      });
  });
  it('test for missing key lastname in the request', (done) => {
    chai.request(server)
      .post('/api/v1/users/signup')
      .send({
        firstname: 'Noah',
        username: 'knoah',
        email: 'noah.kalyesubula@andela.com',
        password: 'Noah2019'
      })
      .end((error, res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.deep.property('message', 'No lastname was specified');
        done();
      });
  });
  it('test for missing username', (done) => {
    chai.request(server)
      .post('/api/v1/users/signup')
      .send({
        firstname: 'Noah',
        lastname: 'Kalyesubula',
        username: '',
        email: 'noah.kalyesubula@andela.com',
        password: 'Noah2019'
      })
      .end((error, res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.deep.property('message', 'No username was specified');
        done();
      });
  });
  it('No password specified', (done) => {
    chai.request(server)
      .post('/api/v1/users/signup')
      .send({
        firstname: 'Noah',
        lastname: 'name',
        email: 'noah.kalyesubula@andela.com',
        username: 'knoah',
        password: ''
      })
      .end((error, res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.deep.property('message');
        done();
      });
  });
  it('No password specified', (done) => {
    chai.request(server)
      .post('/api/v1/users/signup')
      .send({
        firstname: 'Noah',
        lastname: 'name',
        email: 'noah.kalyesubula@andela.com',
        username: 'knoah',
      })
      .end((error, res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.deep.property('message');
        done();
      });
  });
  it('username is required', (done) => {
    chai.request(server)
      .post('/api/v1/users/signup')
      .send({
        firstname: 'Noah',
        lastname: 'name',
        email: 'noah.kalyesubula@andela.com',
        password: 'ASqw123456'
      })
      .end((error, res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.deep.property('message');
        done();
      });
  });
});
