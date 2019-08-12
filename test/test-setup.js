import chai from 'chai';
import chaiHttp from 'chai-http';

import server from '../src/app';


chaiHttp.IncomingMessage.prototype.userAgent = () => this.user[{ displayName: 'mike anguandia' }];
chai.use(chaiHttp);
const { expect } = chai;


export {
  chai, server, expect
};
