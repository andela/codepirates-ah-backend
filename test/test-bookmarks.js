import { chai, expect, server } from './test-setup';

let token;
describe.only('Test article bookmarks', () => {
  before((done) => {
    chai.request(server)
      .post('/api/v1/users/login')
      .send({ email: 'admin@gmail.com', password: 'ASqw12345' })
      .end((error, res) => {
        token = `Bearer ${res.body.token}`;
        done();
      });
  });
  describe.only('test bookmark creation', () => {
    it.only('should create bookmark with name', (done) => {
      chai.request(server)
        .post('/api/v1/users/bookmarks')
        .set('Authorization', token)
        .send({ name: 'bookmark3', articleId: 2 })
        .end((error, res) => {
          if (error) { return done(error); }
          expect(res.status).to.be.equal(201);
          expect(res.body).to.have.deep.property('message', "bookmark 'bookmark3' created");
          expect(res.body.data).to.have.deep.property('name', 'bookmark3');
          done();
        });
    });
    it.only('should not create duplicate bookmark, inform bookmark exists', (done) => {
      chai.request(server)
        .post('/api/v1/users/bookmarks')
        .set('Authorization', token)
        .send({ name: 'bookmark3', articleId: 2 })
        .end((err, res) => {
          if (err) { return done(err); }
          expect(res.status).to.be.equal(200);
          expect(res.body).to.have.deep.property('message', "bookmark 'bookmark3' exists");
          done();
        });
    });
    it.only('should flag user bookmark existing under different name', (done) => {
      chai.request(server)
        .post('/api/v1/users/bookmarks')
        .set('Authorization', token)
        .send({ name: 'bookmark2', articleId: 1 })
        .end((err, res) => {
          if (err) { done(err); }
          expect(res.status).to.be.equal(200);
          expect(res.body).to.have.deep.property('message', "bookmark existing as 'Nigerian jolof'");
          done();
        });
    });
    it.only('should flag any name conflict in users bookmarks', (done) => {
      chai.request(server)
        .post('/api/v1/users/bookmarks')
        .set('authorization', token)
        .send({ name: 'Survival skills', articleId: 2 })
        .end((err, res) => {
          if (err) { done(err); }
          expect(res.status).to.be.equal(200);
          expect(res.body.message).to.include('another bookmark');
          done();
        });
    });
    it.only('should prompt for and support renaming bookmark copy', (done) => {
      chai.request(server)
        .post('/api/v1/users/bookmarks')
        .set('authorization', token)
        .send({ name: 'Ugandan Pilau', articleId: 1 })
        .end(() => {
          chai.request(server)
            .post('/api/v1/users/copy')
            .set('authorization', token)
            .end((err, res) => {
              if (err) { done(err); }
              expect(res.status).to.be.equal(201);
              expect(res.body.message).to.include('copy of bookmark');
              done();
            });
        });
    });
    it.only('should add a bookmark to a collection', (done) => {
      chai.request(server)
        .post('/api/v1/users/bookmarks/collections')
        .set('authorization', token)
        .send({ name: 'Nigerian jolof', articleId: 1, collection: 'cookery' })
        .end((err, res) => {
          if (err) { done(err); }
          expect(res.status).to.be.equal(201);
          expect(res.body.message).to.include("'Nigerian jolof' added to collection");
          done();
        });
    });
    it.only('should flag duplicate addition to collection', (done) => {
      chai.request(server)
        .post('/api/v1/users/bookmarks/collections')
        .set('authorization', token)
        .send({ name: 'Nigerian jolof', articleId: 1, collection: 'cookery' })
        .end((err, res) => {
          if (err) { done(err); }
          expect(res.status).to.be.equal(200);
          expect(res.body.message).to.include("already in collection 'cookery'");
          done();
        });
    });
    // it('should not bookmark article with 5 bookmarks', (done) => {
    //   chai.request(server)
    //     .post('/api/v1/articles/1/bookmarks')
    //     .set('Authorization', token)
    //     .send({ name: 'bookmark45' })
    //     .end((err, res) => {
    //       if (err) { return done(err); }
    //       expect(res.status).to.be.equal(200);
    //       expect(res.body.message).to.include('has the maximum number of bookmarks');
    //       done();
    //     });
    // });
    // it('should notify of the remaining bookmark space', (done) => {
    //   chai.request(server)
    //     .post('/api/v1/articles/2/bookmarks')
    //     .set('Authorization', token)
    //     .send({ name: 'bookmark45, bookmark46, bookmark47' })
    //     .end((err, res) => {
    //       if (err) { return done(err); }
    //       expect(res.status).to.be.equal(200);
    //       expect(res.body.message).to.include('article already has');
    //       done();
    //     });
    // });
  });
  describe.only('Get bookmarks', () => {
    it.only('Should get all bookmarks of the current user', (done) => {
      chai.request(server)
        .get('/api/v1/users/bookmarks')
        .set('authorization', token)
        .end((err, res) => {
          if (err) { done(err); }
          expect(res.status).to.be.equal(200);
          expect(res.body.message).to.be.equal('7 bookmarks found');
          expect(res.body.data).to.be.a('Array');
          done();
        });
    });
    it.only('Should get a specific user bookmark', (done) => {
      chai.request(server)
        .get('/api/v1/users/bookmarks/1')
        .set('authorization', token)
        .send({ name: 'Ugandan Pilau', articleId: 1 })
        .end((err, res) => {
          if (err) { done(err); }
          expect(res.status).to.be.equal(200);
          expect(res.body.message).to.include("bookmark 'Ugandan Pilau'");
          done();
        });
    });
    it('Should return bookmark not found if none-existent', (done) => {
      chai.request(server)
        .get('/api/v1/bookmarks/bookmark13')
        .end((err, res) => {
          if (err) { done(err); }
          expect(res.status).to.be.equal(404);
          expect(res.body).to.have.property('message', 'bookmark bookmark13 not found');
          done();
        });
    });
    it('Should get all articles with the specified bookmark', (done) => {
      chai.request(server)
        .get('/api/v1/bookmarks/bookmark1/articles')
        .end((err, res) => {
          if (err) { done(err); }
          expect(res.status).to.be.equal(200);
          expect(res.body).to.have.property('articles');
          expect(res.body.articles[0]).to.have.lengthOf(3);
          done();
        });
    });
    it('Should return 404 if no articles with the specific bookmark', (done) => {
      chai.request(server)
        .get('/api/v1/bookmarks/bookmark3/articles')
        .end((err, res) => {
          if (err) { done(err); }
          expect(res.status).to.be.equal(404);
          expect(res.body).to.have.deep.property('message', "articles about 'bookmark3' not found");
          done();
        });
    });
    it('Should get all bookmarks of an article', (done) => {
      chai.request(server)
        .get('/api/v1/articles/4/bookmarks')
        .end((err, res) => {
          if (err) { done(err); }
          expect(res.status).to.be.equal(200);
          expect(res.body).to.have.deep.property('bookmarks', ['bookmark1', 'bookmark2']);
          done();
        });
    });
    it.only('Should return appropriate response no collection found', (done) => {
      chai.request(server)
        .get('/api/v1/users/bookmarks/collections/mike')
        .set('Authorization', token)
        .send({ name: 'Ugandan Pilau', articleId: 1 })
        .end((err, res) => {
          if (err) { done(err); }
          expect(res.status).to.be.equal(404);
          expect(res.body.message).to.be.equal('collection  not found');
          done();
        });
    });
    it.only('Should return 404 if no such bookmark', (done) => {
      chai.request(server)
        .get('/api/v1/users/bookmarks/7')
        .set('Authorization', token)
        .send({ name: 'Ugandan Pilau' })
        .end((err, res) => {
          if (err) { done(err); }
          expect(res.status).to.be.equal(404);
          expect(res.body.message).to.include('not found');
          done();
        });
    });
  });
  describe.only('Delete bookmark', () => {
    it.only('Should delete a particular user bookmark', (done) => {
      chai.request(server)
        .delete('/api/v1/users/bookmarks/1')
        .set('Authorization', token)
        .send({ name: 'Ugandan Pilau', articleId: 1 })
        .end((err, res) => {
          if (err) { done(err); }
          expect(res.status).to.be.equal(200);
          expect(res.body.message).to.be.equal("bookmark 'Ugandan Pilau' deleted");
          done();
        });
    });
    it('Should flag absence of bookmark from a specific article', (done) => {
      chai.request(server)
        .delete('/api/v1/articles/1/bookmark3')
        .set('Authorization', token)
        .end((err, res) => {
          if (err) { done(err); }
          expect(res.status).to.be.equal(404);
          expect(res.body).to.have.deep.property('message', "bookmark 'bookmark3' not found");
          done();
        });
    });
    it.only('Should delete all of a given users bookmarks', (done) => {
      chai.request(server)
        .delete('/api/v1/users/bookmarks')
        .set('Authorization', token)
        .end((err, res) => {
          if (err) { done(err); }
          expect(res.status).to.be.equal(200);
          expect(res.body.message).to.be.equal('6 bookmarks deleted');
          done();
        });
    });
    it('Should return appropriate respone if no articles found', (done) => {
      chai.request(server)
        .delete('/api/v1/bookmarks/bookmark11/articles')
        .set('Authorization', token)
        .end((err, res) => {
          if (err) { done(err); }
          expect(res.status).to.be.equal(404);
          expect(res.body.message).to.be.equal("articles about 'bookmark11' not found");
          done();
        });
    });
  });
  describe.only('Test bookmark Update operations', () => {
    it('Should abort update if old and new names the same', (done) => {
      chai.request(server)
        .patch('/api/v1/users/bookmarks')
        .set('Authorization', token)
        .send({ name: 'bookmark5', oldName: 'bookmark5' })
        .end((err, res) => {
          if (err) { done(err); }
          expect(res.status).to.be.equal(400);
          expect(res.body.message).to.include('update aborted');
          done();
        });
    });
    it('Should give correct response if target not found', (done) => {
      chai.request(server)
        .patch('/api/v1/bookmarks/bookmark90')
        .set('Authorization', token)
        .send({ name: 'bookmark4' })
        .end((err, res) => {
          if (err) { done(err); }
          expect(res.status).to.be.equal(404);
          expect(res.body.message).to.be.equal('bookmark bookmark90 not found');
          done();
        });
    });
    it.only('Should update a collections name', (done) => {
      chai.request(server)
        .patch('/api/v1/users/bookmarks/collections')
        .set('Authorization', token)
        .send({ collection: 'master chef', oldCollection: 'cookery' })
        .end((err, res) => {
          if (err) { done(err); }
          expect(res.status).to.be.equal(200);
          expect(res.body.message).to.include("'cookery' updated to");
          done();
        });
    });
    it('Should flag missing target collection', (done) => {
      chai.request(server)
        .patch('/api/v1/users/bookmarks/collections')
        .set('Authorization', token)
        .send({ collection: 'bookmark10', oldCollection: 'forest' })
        .end((err, res) => {
          if (err) { done(err); }
          expect(res.status).to.be.equal(404);
          expect(res.body.message).to.be.equal('collection not found');
          done();
        });
    });
  });
  describe('test user input validation', () => {
    it('should reject long/multi-word bookmarknames', (done) => {
      chai.request(server)
        .post('/api/v1/articles/5/bookmarks')
        .set('Authorization', token)
        .send({ name: 'this is a long bookmark' })
        .end((err, res) => {
          if (err) { return done(err); }
          expect(res.status).to.be.equal(400);
          expect(res.body.error).to.include('bookmark name must be maximum three words');
          done();
        });
    });
    it('should flag unaccepted bookmarkname bookmarknames', (done) => {
      chai.request(server)
        .get('/api/v1/bookmarks/bookmark@2')
        .end((err, res) => {
          if (err) { return done(err); }
          expect(res.status).to.be.equal(400);
          expect(res.body.error).to.include('name must be descriptive');
          done();
        });
    });
  });
});
