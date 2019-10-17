
// import { server, expect, chai } from './test-setup';

// describe('Social login tests', () => {
//   describe('Existing social user should be able to login', () => {
//     before((done) => {
//       process.env.facebook = 'facebook_existing';
//       process.env.google = 'google_existing';
//       process.env.twitter = 'twitter_existing';
//       done();
//     });

//     it('should...with facebook', (done) => {
//       chai.request(server)
//         .get('/login/facebook')
//         .end((err, res) => {
//           if (err) { done(err); }
//           expect(res.status).to.be.equal(200);
//           expect(res.body).to.have.property('token');
//           expect(res.body).to.have.deep.property('message', 'Logged in successfully');
//           done();
//         });
//     });
//     it('should...with google', (done) => {
//       chai.request(server)
//         .get('/login/google')
//         .end((err, res) => {
//           if (err) { done(err); }
//           expect(res.status).to.be.equal(200);
//           expect(res.body).to.have.property('token');
//           expect(res.body).to.have.deep.property('message', 'Logged in successfully');
//           done();
//         });
//     });
//     it('should...with twitter', (done) => {
//       chai.request(server)
//         .get('/login/twitter')
//         .end((err, res) => {
//           if (err) { done(err); }
//           expect(res.status).to.be.equal(200);
//           expect(res.body).to.have.property('token');
//           expect(res.body).to.have.deep.property('message', 'Logged in successfully');
//           done();
//         });
//     });
//   });

//   describe('Test social signup', () => {
//     before((done) => {
//       process.env.facebook = 'facebook_new';
//       process.env.google = 'google_new';
//       process.env.twitter = 'twitter_new';
//       done();
//     });
//     it('should notify register new social user', (done) => {
//       chai.request(server)
//         .get('/login/facebook')
//         .end((err, res) => {
//           if (err) { done(err); }
//           expect(res.status).to.be.equal(201);
//           expect(res.body.message).to.contain('Account created');
//           done();
//         });
//     });
//     it('should remind of email update if using twitter', (done) => {
//       chai.request(server)
//         .get('/login/twitter')
//         .end((err, res) => {
//           if (err) { done(err); }
//           expect(res.status).to.be.equal(201);
//           expect(res.body.message).to.contain('and update your email');
//           done();
//         });
//     });
//   });
// });

// export default server;
