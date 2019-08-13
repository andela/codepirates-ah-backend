import { chai, server, expect } from './test-setup';

<<<<<<< HEAD
describe('test index', () => {
  it('should return welcome to author\'s heaven', (done) => {
=======
describe.skip('test index', (done) => {
  it('should return welcome to author\'s heaven', () => {
>>>>>>> respond to feedback
    chai.request(server)
      .get('/')
      .end((error, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.deep.property('data', 'Welcome to Authors Haven.');
        done();
      });
  });
});
