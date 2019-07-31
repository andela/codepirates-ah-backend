import chai from 'chai';
import chaiHttp from 'chai-http';

import app from '../src/index';

chai.use(chaiHttp);
should = chai.should();


export {chai, app};