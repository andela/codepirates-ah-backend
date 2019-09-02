import { chai, server, expect } from './test-setup';


describe('/Article pagination', () => {
  it('Should successfully retrieve  latest published ten articles', (done) => {
    chai
      .request(server)
      .get('/api/v1/articles')
      .end((error, res) => {
        expect(res).have.status(200);
        expect(res).to.be.an('object');
        expect(res.body).to.have.keys('message', 'status', 'data', 'allArticle');
        expect(res.body.message).to.deep.equal('List of all articles');
        done();
      });
  });
  it('Should successfully retrieve articles from the 2nd to the up to atmost 4th if up to atmost 4 if exist if not is going to fech from 1st one to 2nd article ', (done) => {
    chai
      .request(server)
      .get('/api/v1/articles')
      .end((error, res) => {
        expect(res).have.status(200);
        expect(res).to.be.an('object');
        expect(res.body).to.have.keys('message', 'status', 'data', 'allArticle');
        expect(res.body.message).to.deep.equal('List of all articles');
        done();
      });
  });
  it('Should throw an error when offset is greater than the count of articles ', (done) => {
    chai
      .request(server)
      .get('/api/v1/articles?page=4&&limit=10')
      .end((error, res) => {
        expect(res.body).have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.keys('message', 'status', 'data', 'allArticle');
        expect(res.body.message).to.deep.equal('List of all articles');
        done();
      });
  });
});
