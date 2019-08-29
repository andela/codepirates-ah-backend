// import { chai, server, expect } from './test-setup';

// let adminToken;
// let userToken;
// describe('Users', () => {
//   before('Login User', (done) => {
//     chai
//       .request(server)
//       .post('/api/v1/users/login')
//       .send({
//         email: 'admin@gmail.com',
//         password: 'ASqw12345'
//       })
//       .set('Accept', 'Application/JSON')
//       .end((error, res) => {
//         adminToken = `Bearer ${res.body.token}`;
//       });
//     chai
//       .request(server)
//       .post('/api/v1/users/login')
//       .send({
//         email: 'user@gmail.com',
//         password: 'ASqw12345'
//       })
//       .set('Accept', 'Application/JSON')
//       .end((error, res) => {
//         userToken = `Bearer ${res.body.token}`;
//         done();
//       });
//   });

//   describe('/POST rate article', () => {
//     it('should be able to rate article', (done) => {
//       chai
//         .request(server)
//         .post('/api/v1/rate/fakeslug')
//         .set('Authorization', userToken)
//         .send({
//           rate: 1
//         })
//         .set('Accept', 'Application/JSON')
//         .end((error, res) => {
//           expect(res.status).to.be.equal(200);
//           expect(res.body).to.have.deep.property('message', 'Thank you for rating this article');
//           done();
//         });
//     });
//     it('should return bad request type of error if a validation error occurs', (done) => {
//       chai
//         .request(server)
//         .post('/api/v1/rate/fakeslug')
//         .set('Authorization', userToken)
//         .send({
//           rate: 8
//         })
//         .set('Accept', 'Application/JSON')
//         .end((error, res) => {
//           expect(res.status).to.be.equal(400);
//           done();
//         });
//     });
//     it('should return bad request type of error if a article owner tries to rate his/her own article', (done) => {
//       chai
//         .request(server)
//         .post('/api/v1/rate/fakeslug')
//         .set('Authorization', adminToken)
//         .send({
//           rate: 4
//         })
//         .set('Accept', 'Application/JSON')
//         .end((error, res) => {
//           expect(res.status).to.be.equal(400);
//           done();
//         });
//     });
//   });
//   describe('/PATCH rate article', () => {
//     it('should be able to rate article', (done) => {
//       chai
//         .request(server)
//         .patch('/api/v1/rate/fakeslug')
//         .set('Authorization', userToken)
//         .send({
//           rate: 3
//         })
//         .set('Accept', 'Application/JSON')
//         .end((error, res) => {
//           expect(res.status).to.be.equal(200);
//           expect(res.body).to.have.deep.property('message', 'Thank you for rating this article');
//           done();
//         });
//     });
//   });
//   describe('/PATCH rate article', () => {
//     it('should be able to rate article', (done) => {
//       chai
//         .request(server)
//         .get('/api/v1/rate/fakeslug')
//         .set('Authorization', userToken)
//         .end((error, res) => {
//           expect(res.status).to.be.equal(200);
//           expect(res.body).to.have.deep.property('message', 'Rating for article with slug fakeslug found');
//           done();
//         });
//     });
//     it('should return error if rate not found', (done) => {
//       chai
//         .request(server)
//         .get('/api/v1/rate/fakeslug')
//         .set('Authorization', userToken)
//         .end((error, res) => {
//           expect(res.status).to.be.equal(200);
//           expect(res.body).to.have.deep.property('message', 'Rating for article with slug fakeslug found');
//           done();
//         });
//     });
//   });
// });
