import { expect } from './test-setup';
import { sendEmail } from '../src/helpers/verification-email';

describe('Users', () => {
  it('should return something when email is send', async () => {
    const results = await sendEmail('admin@gmail.com', 'admin', 'http://localhost:3000/api/v1/users/verify');
    expect(results[0]).to.be.an('object');
  });
});
