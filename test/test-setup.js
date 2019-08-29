import chai from 'chai';
import chaiHttp from 'chai-http';
import sinonChai from 'sinon-chai';
import server from '../src/app';


chai.use(chaiHttp);
chai.use(sinonChai);
const { expect } = chai;


export {
  chai, server, expect
};
