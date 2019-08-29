import { chai, expect, server } from './test-setup';

let token;
describe('Test article bookmarks', () => {
  before((done) => {
    chai.request(server)
      .post('/api/v1/users/login')
      .send({ email: 'admin@gmail.com', password: 'ASqw12345' })
      .end((error, res) => {
        token = `Bearer ${res.body.token}`;
        done();
      });
  });
  describe('test bookmark creation', () => {
    it('should create bookmark with name', (done) => {
      chai.request(server)
        .post('/api/v1/users/bookmarks')
        .set('Authorization', token)
        .send({ name: 'bookmark3', articleId: 6 })
        .end((error, res) => {
          if (error) { return done(error); }
          expect(res.status).to.be.equal(201);
          expect(res.body.message).to.be.equal("bookmark 'bookmark3' created");
          expect(res.body.data).to.have.deep.property('name', 'bookmark3');
          done();
        });
    });
    it('should provide default name if no name given', (done) => {
      chai.request(server)
        .post('/api/v1/users/bookmarks')
        .set('Authorization', token)
        .send({ articleId: 4, name: '' })
        .end((error, res) => {
          if (error) { return done(error); }
          expect(res.status).to.be.equal(201);
          expect(res.body.data.name).to.include('title3-');
          done();
        });
    });
    it('should not create duplicate bookmark, inform bookmark exists', (done) => {
      chai.request(server)
        .post('/api/v1/users/bookmarks')
        .set('Authorization', token)
        .send({ name: 'Nigerian jolof', articleId: 1 })
        .end((err, res) => {
          expect(res.status).to.be.equal(200);
          expect(res.body.message).to.include('exists');
          done();
        });
    });
    it('should flag user bookmark existing under different name', (done) => {
      chai.request(server)
        .post('/api/v1/users/bookmarks')
        .set('Authorization', token)
        .send({ name: 'bookmark2', articleId: 1 })
        .end((err, res) => {
          expect(res.status).to.be.equal(409);
          expect(res.body).to.have.deep.property('message', "bookmark existing as 'Nigerian jolof'");
          done();
        });
    });
    it('should flag any name conflict in users bookmarks', (done) => {
      chai.request(server)
        .post('/api/v1/users/bookmarks')
        .set('authorization', token)
        .send({ name: 'Survival skills', articleId: 5 })
        .end((err, res) => {
          expect(res.status).to.be.equal(409);
          expect(res.body.message).to.include('another bookmark');
          done();
        });
    });
    it('should prompt for and support renaming bookmark copy', (done) => {
      chai.request(server)
        .post('/api/v1/users/bookmarks')
        .set('authorization', token)
        .send({ name: 'Ugandan Pilau', articleId: 1 })
        .end(() => {
          chai.request(server)
            .post('/api/v1/users/bookmarks/copy')
            .set('authorization', token)
            .end((err, res) => {
              expect(res.status).to.be.equal(201);
              expect(res.body.message).to.include('copy of bookmark');
              done();
            });
        });
    });
    it('should prompt for updating instead of duplicating bookmark',
      (done) => {
        chai.request(server)
          .post('/api/v1/users/bookmarks')
          .set('authorization', token)
          .send({ name: 'Ugandan Pilau', articleId: 1 })
          .end(() => {
            chai.request(server)
              .patch('/api/v1/users/bookmarks/update')
              .set('authorization', token)
              .end((err, res) => {
                expect(res.status).to.be.equal(200);
                expect(res.body.message).to.include('updated to Ugandan Pilau');
                done();
              });
          });
      });
    it('Should notify if no collections', (done) => {
      chai.request(server)
        .get('/api/v1/users/bookmarks/collections')
        .set('authorization', token)
        .end((err, res) => {
          expect(res.status).to.be.equal(404);
          expect(res.body.message).to.be.equal('collections not found');
          done();
        });
    });
    it('should add a bookmark to a collection', (done) => {
      chai.request(server)
        .post('/api/v1/users/bookmarks/collections')
        .set('authorization', token)
        .send({ name: 'Ugandan Pilau', articleId: 1, collection: 'cookery' })
        .end((err, res) => {
          expect(res.status).to.be.equal(201);
          expect(res.body.message).to.include("'Ugandan Pilau' added to collection");
          done();
        });
    });
    it('should flag duplicate addition to collection', (done) => {
      chai.request(server)
        .post('/api/v1/users/bookmarks/collections')
        .set('authorization', token)
        .send({ name: 'Ugandan Pilau', articleId: 1, collection: 'cookery' })
        .end((err, res) => {
          expect(res.status).to.be.equal(200);
          expect(res.body.message).to.include("already in collection 'cookery'");
          done();
        });
    });
  });
  describe('Get bookmarks', () => {
    it('Should get all bookmarks of the current user', (done) => {
      chai.request(server)
        .get('/api/v1/users/bookmarks')
        .set('authorization', token)
        .end((err, res) => {
          expect(res.status).to.be.equal(200);
          expect(res.body.message).to.be.include('bookmarks found');
          expect(res.body.data).to.be.a('Array');
          done();
        });
    });
    it('Should get a specific user bookmark', (done) => {
      chai.request(server)
        .get('/api/v1/users/bookmarks/Ugandan Pilau')
        .set('authorization', token)
        .end((err, res) => {
          expect(res.status).to.be.equal(200);
          expect(res.body.message).to.include("bookmark 'Ugandan Pilau'");
          done();
        });
    });
    it('Should return appropriate response collection not found', (done) => {
      chai.request(server)
        .get('/api/v1/users/bookmarks/collections/mike')
        .set('Authorization', token)
        .end((err, res) => {
          expect(res.status).to.be.equal(404);
          expect(res.body.message).to.be.equal("collection 'mike' not found");
          done();
        });
    });
    it('Should return 404 if no such bookmark', (done) => {
      chai.request(server)
        .get('/api/v1/users/bookmarks/7')
        .set('Authorization', token)
        .send({ name: 'Ugandan Pilau' })
        .end((err, res) => {
          expect(res.status).to.be.equal(404);
          expect(res.body.message).to.include('not found');
          done();
        });
    });
  });
  describe('Test bookmark Update operations', () => {
    it('Should abort update if old and new names the same', (done) => {
      chai.request(server)
        .patch('/api/v1/users/bookmarks/Ugandan Pilau')
        .set('Authorization', token)
        .send({ name: 'Ugandan Pilau', oldName: 'Ugandan Pilau', articleId: 1 })
        .end((err, res) => {
          expect(res.status).to.be.equal(400);
          expect(res.body.message).to.include('update aborted');
          done();
        });
    });
    it('Should update a collections name', (done) => {
      chai.request(server)
        .patch('/api/v1/users/bookmarks/collections/cookery')
        .set('Authorization', token)
        .send({ collection: 'master chef' })
        .end((err, res) => {
          expect(res.status).to.be.equal(200);
          expect(res.body.message).to.include("'cookery' updated to");
          done();
        });
    });
    it('Should flag missing target collection', (done) => {
      chai.request(server)
        .patch('/api/v1/users/bookmarks/collections/forest')
        .set('Authorization', token)
        .send({ collection: 'bookmark10' })
        .end((err, res) => {
          expect(res.status).to.be.equal(404);
          expect(res.body.message).to.be.equal("collection 'forest' not found");
          done();
        });
    });
  });
  describe('Delete bookmark', () => {
    it('Should delete a given bookmark from a collection', (done) => {
      chai.request(server)
        .post('/api/v1/users/bookmarks/collections')
        .set('Authorization', token)
        .send({ collection: 'names', name: 'kuku', articleId: 3 })
        .end(() => {
          chai.request(server)
            .delete('/api/v1/users/bookmarks/collections/names/kuku')
            .set('Authorization', token)
            .end((err, res) => {
              expect(res.status).to.be.equal(404);
              expect(res.body.message).to.include('deleted from collection');
              done();
            });
        });
    });
    it('Should notify of missing target in collection', (done) => {
      chai.request(server)
        .delete('/api/v1/users/bookmarks/collections/names/mike')
        .set('Authorization', token)
        .end((err, res) => {
          expect(res.status).to.be.equal(404);
          expect(res.body.message).to.be.equal("bookmark 'mike' not found");
          done();
        });
    });
    it('Should notify if collection to be deleted non-existin', (done) => {
      chai.request(server)
        .delete('/api/v1/users/bookmarks/collections/mike')
        .set('Authorization', token)
        .end((err, res) => {
          expect(res.status).to.be.equal(404);
          expect(res.body.message).to.be.equal("collection 'mike' not found");
          done();
        });
    });
    it('Should delete a particular user bookmark', (done) => {
      chai.request(server)
        .delete('/api/v1/users/bookmarks/Ugandan Pilau')
        .set('Authorization', token)
        .end((err, res) => {
          expect(res.status).to.be.equal(404);
          expect(res.body.message).to.be.equal("bookmark 'Ugandan Pilau' deleted");
          done();
        });
    });
    it('Should delete all of a given users bookmarks', (done) => {
      chai.request(server)
        .delete('/api/v1/users/bookmarks')
        .set('Authorization', token)
        .end((err, res) => {
          expect(res.status).to.be.equal(404);
          expect(res.body.message).to.be.include('bookmarks deleted');
          done();
        });
    });
  });
});
