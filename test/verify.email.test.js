import 'dotenv/config';
import { chai, server, expect } from './test-setup';
import Helper from '../src/helpers/helper';
import createUser from '../src/services/user.service';
import sendEmail from '../src/helpers/verification-email';
import db from '../src/models';

const user = {
  firstname: 'habineza',
  lastname: 'christian',
  email: 'habinezadalvan@gmail.com',
  password: 'ASqw12345',
  username: 'habinezadalvan'
};
describe('Users', () => {
  before(async () => {
    await createUser.addUser(user);
  });
  after(async () => {
    await db.user.destroy({
      where: { email: 'habinezadalvan@gmail.com' }
    });
  });
  const token = Helper.generateToken({
    email: 'habinezadalvan@gmail.com',
    role: 'normal',
    verified: 'false'
  });

  it('should verify email', (done) => {
    chai
      .request(server)
      .get(`/api/v1/users/verify?token=${token}`)
      .end((error, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.deep.property('message');
        done();
      });
  });
  it('should send email from controller', (done) => {
    const url = `/api/v1/users/verify?token=${token}`;
    sendEmail(user.email, user.username, url);
    done();
  });
  it('should catch an error when token is not verified', (done) => {
    const results = Helper.verifyToken();
    expect(results).to.equal('jwt must be provided');
    done();
  });
});
