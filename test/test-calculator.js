import chai from 'chai';
import chaiHttp from 'chai-http';

import server from '../src/app';


chai.use(chaiHttp);
const { expect } = chai;

describe('test calculator operations', () => {
  it('test for valid inputs', (done) => {
    chai.request(server)
      .post('/operations')
      .send({
        expr: '1.2+4.5'
      })
      .end((error, res) => {
        expect(res.status).to.equal(201);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('result');
        expect(res.body).to.have.property('error');
        expect(res.body).to.have.deep.property('result', 5.7);
        expect(res.body).to.have.deep.property('error', null);
        done();
      });
  });
  it('test for wrong inputs', (done) => {
    chai.request(server)
      .post('/operations')
      .send({
        expr: 'xxxxxx'
      })
      .end((error, res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('result');
        expect(res.body).to.have.property('error');
        expect(res.body).to.have.deep.property('result', null);
        expect(res.body).to.have.deep.property('error', 'The equation is invalid');
        done();
      });
  });
  it('test for missing required parameters', (done) => {
    chai.request(server)
      .post('/operations')
      .send({

      })
      .end((error, res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('result');
        expect(res.body).to.have.property('error');
        expect(res.body).to.have.deep.property('result', null);
        expect(res.body).to.have.deep.property('error', 'Required query parameter "expr" missing in url');
        done();
      });
  });
  it('test for a wrong route', (done) => {
    chai.request(server)
      .post('/xxxxxx')
      .send({

      })
      .end((error, res) => {
        expect(res.status).to.equal(404);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error');
        expect(res.body).to.have.deep.property('error', 'Resource not found');
        done();
      });
  });
});
