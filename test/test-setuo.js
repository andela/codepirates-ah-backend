import chai from 'chai';
import chaiHttp from 'chai-http';

import server from '../src/app';


chai.use(chaiHttp);
should = chai.should();


export {chai, server};