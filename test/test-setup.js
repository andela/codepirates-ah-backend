import chai from 'chai';
import chaiHttp from 'chai-http';

import server from '../src/app';


chai.use(chaiHttp);
const { expect } = chai;


export { chai, server, expect };
