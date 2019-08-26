// import { chai, server, expect } from './test-setup';
// import Helper from '../src/helpers/helper';

// const usertoken = Helper.generateToken({
//   id: 2,
//   email: 'user@gmail.com',
//   username: 'user',
//   verified: false
// });

// describe('search article query builder', () => {
//   it('List of all articles', (done) => {
//     chai
//       .request(server)
//       .get('/api/v1/articles')
//       .set('Content-Type', 'application/json')
//       .set('Authorization', usertoken)
//       .end((err, res) => {
//         expect(res.status).to.be.deep.equal(200);
//         expect(res.body).to.have.deep.property('message', 'List of all articles');
//       });
//     done();
//   });
//   it('Title and description in the query', (done) => {
//     chai
//       .request(server)
//       .get('/api/v1/articles?title=Title&&keyword=here')
//       .set('Content-Type', 'application/json')
//       .set('Authorization', usertoken)
//       .end((err, res) => {
//         if (err) done(err);
//         expect(res.status).to.be.deep.equal(200);
//         expect(res.body).to.have.deep.property('message', 'List of all articles');
//       });
//     done();
//   });
//   it('if invalid query key', (done) => {
//     chai
//       .request(server)
//       .get('/api/v1/articles?key=Tilltle')
//       .set('Content-Type', 'application/json')
//       .set('Authorization', usertoken)
//       .end((err, res) => {
//         if (err) done(err);
//         expect(res.status).to.be.deep.equal(400);
//         expect(res.body).to.have.deep.property('error');
//       });
//     done();
//   });
// });
