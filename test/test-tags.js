import { chai, expect, server } from './test-setup';

let token;
describe('Test article tags', () => {
  before((done) => {
    chai.request(server)
      .post('/api/v1/users/login')
      .send({ email: 'admin@gmail.com', password: 'ASqw12345' })
      .end((error, res) => {
        token = `Bearer ${res.body.token}`;
        done();
      });
  });
  describe('test tag creation', () => {
    it('should create an orphan tag with no articles', (done) => {
      chai.request(server)
        .post('/api/v1/tags')
        .set('Authorization', token)
        .send({ name: 'tag3' })
        .end((error, res) => {
          if (error) { return done(error); }
          expect(res.status).to.be.equal(201);
          expect(res.body).to.have.deep.property('message', "tag 'tag3' created");
          expect(res.body.data).to.have.deep.property('name', 'tag3');
          done();
        });
    });
    it('should not create duplicate tag, inform tag exists', (done) => {
      chai.request(server)
        .post('/api/v1/tags')
        .set('Authorization', token)
        .send({ name: 'tag3' })
        .end((err, res) => {
          if (err) { return done(err); }
          expect(res.status).to.be.equal(200);
          expect(res.body).to.have.deep.property('message', "tag 'tag3' exists");
          done();
        });
    });
  });
  describe('Tag an article', () => {
    it('should tag an article with an existing single tag', (done) => {
      chai.request(server)
        .post('/api/v1/articles/1/tags')
        .set('Authorization', token)
        .send({ name: 'tag2' })
        .end((err, res) => {
          if (err) { done(err); }
          expect(res.status).to.be.equal(201);
          expect(res.body).to.have.deep.property('message', 'article tagged as tag2');
          done();
        });
    });
    it('should not do duplicate tagging', (done) => {
      chai.request(server)
        .post('/api/v1/articles/1/tags')
        .set('authorization', token)
        .send({ name: 'tag2' })
        .end((err, res) => {
          if (err) { done(err); }
          expect(res.status).to.be.equal(200);
          expect(res.body).to.have.deep.property('message', 'article already tagged as tag2');
          done();
        });
    });
    it('should support multiple simulatneous tagging', (done) => {
      chai.request(server)
        .post('/api/v1/articles/1/tags')
        .set('authorization', token)
        .send({ name: 'tag20, tag21, tag22' })
        .end((err, res) => {
          if (err) { done(err); }
          expect(res.status).to.be.equal(201);
          expect(res.body).to.have.deep.property('message', 'article tagged as tag20, tag21, tag22');
          done();
        });
    });
    it('should return correct responsen if some duplicate tagging', (done) => {
      chai.request(server)
        .post('/api/v1/articles/2/tags')
        .set('authorization', token)
        .send({ name: 'tag2, tag21, tag22' })
        .end((err, res) => {
          if (err) { done(err); }
          expect(res.status).to.be.equal(200);
          expect(res.body.message).to.include('already tagged as tag2; new tagging tag21, tag22');
          done();
        });
    });
    it('should flag missing target article', (done) => {
      chai.request(server)
        .post('/api/v1/articles/11/tags')
        .set('authorization', token)
        .send({ name: 'tag20, tag21, tag22' })
        .end((err, res) => {
          if (err) { done(err); }
          expect(res.status).to.be.equal(404);
          expect(res.body).to.have.deep.property('message', 'article not found');
          done();
        });
    });
    it('should not tag article with 5 tags', (done) => {
      chai.request(server)
        .post('/api/v1/articles/1/tags')
        .set('Authorization', token)
        .send({ name: 'tag45' })
        .end((err, res) => {
          if (err) { return done(err); }
          expect(res.status).to.be.equal(200);
          expect(res.body.message).to.include('has the maximum number of tags');
          done();
        });
    });
    it('should notify of the remaining tag space', (done) => {
      chai.request(server)
        .post('/api/v1/articles/2/tags')
        .set('Authorization', token)
        .send({ name: 'tag45, tag46, tag47' })
        .end((err, res) => {
          if (err) { return done(err); }
          expect(res.status).to.be.equal(200);
          expect(res.body.message).to.include('article already has');
          done();
        });
    });
  });
  describe('Get tags', () => {
    it('Should get all tags with the number of articles with each tag', (done) => {
      chai.request(server)
        .get('/api/v1/tags')
        .end((err, res) => {
          if (err) { done(err); }
          expect(res.status).to.be.equal(200);
          expect(res.body).to.have.property('data');
          done();
        });
    });
    it('Should get a specific tag and the number of articles', (done) => {
      chai.request(server)
        .get('/api/v1/tags/tag1')
        .end((err, res) => {
          if (err) { done(err); }
          expect(res.status).to.be.equal(200);
          expect(res.body).to.have.property('data');
          expect(res.body).to.have.deep.property('message', 'Tag retrieved successfully');
          done();
        });
    });
    it('Should return tag not found if none-existent', (done) => {
      chai.request(server)
        .get('/api/v1/tags/tag13')
        .end((err, res) => {
          if (err) { done(err); }
          expect(res.status).to.be.equal(404);
          expect(res.body).to.have.property('message', 'tag tag13 not found');
          done();
        });
    });
    it('Should get all articles with the specified tag', (done) => {
      chai.request(server)
        .get('/api/v1/tags/tag1/articles')
        .end((err, res) => {
          if (err) { done(err); }
          expect(res.status).to.be.equal(200);
          expect(res.body).to.have.property('articles');
          expect(res.body.articles[0]).to.have.lengthOf(3);
          done();
        });
    });
    it('Should return 404 if no articles with the specific tag', (done) => {
      chai.request(server)
        .get('/api/v1/tags/tag3/articles')
        .end((err, res) => {
          if (err) { done(err); }
          expect(res.status).to.be.equal(404);
          expect(res.body).to.have.deep.property('message', "articles about 'tag3' not found");
          done();
        });
    });
    it('Should get all tags of an article', (done) => {
      chai.request(server)
        .get('/api/v1/articles/4/tags')
        .end((err, res) => {
          if (err) { done(err); }
          expect(res.status).to.be.equal(200);
          expect(res.body.data).to.have.deep.property('tags', ['tag1', 'tag2']);
          done();
        });
    });
    it('Should return appropriate response if article not tagged', (done) => {
      chai.request(server)
        .get('/api/v1/articles/5/tags')
        .end((err, res) => {
          if (err) { done(err); }
          expect(res.status).to.be.equal(200);
          expect(res.body).to.have.deep.property('message', 'article not tagged');
          done();
        });
    });
    it('Should return 404 if no such article', (done) => {
      chai.request(server)
        .get('/api/v1/articles/33/tags')
        .end((err, res) => {
          if (err) { done(err); }
          expect(res.status).to.be.equal(404);
          expect(res.body).to.have.deep.property('message', 'article not found');
          done();
        });
    });
  });
  describe('Delete tags and associations', () => {
    it('Should delete a particular tag from a specific article', (done) => {
      chai.request(server)
        .delete('/api/v1/articles/4/tag2')
        .set('Authorization', token)
        .end((err, res) => {
          if (err) { done(err); }
          expect(res.status).to.be.equal(200);
          expect(res.body.message).to.include('tag tag2 removed');
          done();
        });
    });
    it('Should flag absence of tag from a specific article', (done) => {
      chai.request(server)
        .delete('/api/v1/articles/1/tag3')
        .set('Authorization', token)
        .end((err, res) => {
          if (err) { done(err); }
          expect(res.status).to.be.equal(404);
          expect(res.body).to.have.deep.property('message', "tag 'tag3' not found");
          done();
        });
    });
    it('Should delete all articles with a given tag', (done) => {
      chai.request(server)
        .delete('/api/v1/tags/tag1/articles')
        .set('Authorization', token)
        .end((err, res) => {
          if (err) { done(err); }
          expect(res.status).to.be.equal(200);
          expect(res.body.message).to.be.equal("all articles about 'tag1' deleted");
          done();
        });
    });
    it('Should return appropriate respone if no articles found', (done) => {
      chai.request(server)
        .delete('/api/v1/tags/tag11/articles')
        .set('Authorization', token)
        .end((err, res) => {
          if (err) { done(err); }
          expect(res.status).to.be.equal(404);
          expect(res.body.message).to.be.equal("articles about 'tag11' not found");
          done();
        });
    });
  });
  describe('Test tag and association Update operations', () => {
    it('Should change the name of a tag', (done) => {
      chai.request(server)
        .patch('/api/v1/tags/tag1')
        .set('Authorization', token)
        .send({ name: 'tag5' })
        .end((err, res) => {
          if (err) { done(err); }
          expect(res.status).to.be.equal(200);
          expect(res.body.message).to.be.equal("tag 'tag1' updated to 'tag5'");
          done();
        });
    });
    it('Should give correct response if target not found', (done) => {
      chai.request(server)
        .patch('/api/v1/tags/tag90')
        .set('Authorization', token)
        .send({ name: 'tag4' })
        .end((err, res) => {
          if (err) { done(err); }
          expect(res.status).to.be.equal(404);
          expect(res.body.message).to.be.equal('tag tag90 not found');
          done();
        });
    });
    it('Should update an articles tag', (done) => {
      chai.request(server)
        .patch('/api/v1/articles/2/tag2')
        .set('Authorization', token)
        .send({ name: 'tag10' })
        .end((err, res) => {
          if (err) { done(err); }
          expect(res.status).to.be.equal(200);
          expect(res.body.message).to.be.equal('update successful');
          done();
        });
    });
    it('Should flag missing target tag', (done) => {
      chai.request(server)
        .patch('/api/v1/articles/3/tag2')
        .set('Authorization', token)
        .send({ name: 'tag10' })
        .end((err, res) => {
          if (err) { done(err); }
          expect(res.status).to.be.equal(200);
          expect(res.body.message).to.be.equal('article has no tag \'tag2\'');
          done();
        });
    });
  });
  describe('test user input validation', () => {
    it('should reject long/multi-word tagnames', (done) => {
      chai.request(server)
        .post('/api/v1/articles/5/tags')
        .set('Authorization', token)
        .send({ name: 'this is a long tag' })
        .end((err, res) => {
          if (err) { return done(err); }
          expect(res.status).to.be.equal(400);
          expect(res.body.error).to.include('tag name must be maximum three words');
          done();
        });
    });
    it('should flag unaccepted tagname tagnames', (done) => {
      chai.request(server)
        .get('/api/v1/tags/tag@2')
        .end((err, res) => {
          if (err) { return done(err); }
          expect(res.status).to.be.equal(400);
          expect(res.body.error).to.include('name must be descriptive');
          done();
        });
    });
  });
});
