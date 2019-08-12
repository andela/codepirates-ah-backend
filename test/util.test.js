import { expect } from './test-setup';
import Util from '../src/helpers/util';

const util = new Util();
describe('util', () => {
  it('should return success json object', () => {
    util.setSuccess(200, 'success', { data: 'success' });
    const res = {
      status: 200,
      message: 'hahaha',
      data: 'hahah'
    };
    expect(res).to.have.deep.property('status');
    expect(res).to.have.deep.property('message');
    expect(res).to.have.deep.property('data');
  });
});
