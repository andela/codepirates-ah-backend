const chai = require('chai');
const chaiHttp = require('chai-http');
const Browser = require('zombie');

const server = require('../src/app');

chai.use(chaiHttp);
const { expect } = chai;


Browser.localhost('localhost.com', 3000);

describe('should singup user via with twitter', () => {
  const browser = new Browser();

  before((done) => {
    browser.timeout = 3600000;
    browser.visit('http://localhost:3000/login/twitter', done);
  });

  describe('should submit form', () => {
    before((done) => {
      browser
        .fill('session[username_or_email]', 'mikeanguandia@gmail.com');
      browser.fill('session[password]', 'kukuer1211');
      browser.pressButton('#allow', done);
    });

    it('should be successful', () => {
      browser.assert.success();
    });

    it('should login existing user', () => {
      expect(browser.status).to.be.equal(200);
      expect(browser.text()).to.contain('Logged in successfully');
    });
  });
});

describe('should prompt for singup of new user from twitter', () => {
  const browser = new Browser();

  before((done) => {
    browser.timeout = 3600000;
    browser.visit('http://localhost:3000/login/twitter', done);
  });

  describe('submit form', () => {
    before((done) => {
      browser
        .fill('session[username_or_email]', '@AnguandiaMike');
      browser.fill('session[password]', 'kukuer1211');
      browser.pressButton('#allow', done);
    });

    it('should be successful', () => {
      browser.assert.success();
    });

    it('should send promt to user', () => {
      expect(browser.status).to.equal(200);
      expect(browser.text()).to.contain('does not exist, create?');
    });
  });
});
// test facebook login
describe('should login user via facebook', () => {
  const browser = new Browser();

  before((done) => {
    browser.timeout = 36000;
    browser.visit('http://localhost:3000/login/facebook', done);
  });

  describe('should submit form', () => {
    before((done) => {
      browser
        .fill('email', 'anguamike@gmail.com');
      browser.fill('pass', 'kukuer1211');
      browser.pressButton('login', done);
    });

    it('should be successful', () => {
      browser.assert.success();
    });

    it('should login existing user', () => {
      expect(browser.status).to.be.equal(200);
    });
  });
});

describe('should prompt for singup of new user from facebook', () => {
  const browser = new Browser();

  before((done) => {
    browser.timeout = 3600000;
    browser.visit('http://localhost:3000/login/facebook', done);
  });

  describe('submit form', () => {
    before((done) => {
      browser
        .fill('email', '+250789888652');
      browser.fill('pass', 'kukuer1211');
      browser.pressButton('login', done);
    });

    it('should be successful', () => {
      browser.assert.success();
    });

    it('should send promt to user', () => {
      expect(browser.status).to.equal(200);
    });
  });
});
// test google signup
describe('should singup user via google', () => {
  let browser = new Browser();

  before(done => browser.visit('http://localhost:3000/login/google', done));

  describe('submit forms', () => {
    before((done) => {
      browser.fill('identifier', 'mikeanguandia@gmail.com');
      browser.pressButton('#identifierNext', done)
        .then((req, res) => {
          browser = new Browser();
          browser.visit(res.location.href);
          browser.fill('password', 'kukuer1211');
          browser.pressButton('#passwordNext');
          done();
        });
      it('should be successful', () => {
        browser.assert.success();
      });

      it('should login existing user', () => {
        browser.assert.status(200);
      });
    });
  });
});

describe('social signup', () => {
  describe('should signup non-existing social user when consented', () => {
    const browser = new Browser();

    before((done) => {
      browser.timeout = 3600000;
      browser.visit('http://localhost:3000/login/twitter', done);
    });

    describe('submit form', () => {
      before((done) => {
        browser
          .fill('session[username_or_email]', '@AnguandiaMike');
        browser.fill('session[password]', 'kukuer1211');
        browser.pressButton('#allow', done);
      });
      before((done) => {
        browser.visit('http://localhost:3000/signup/social', done);
      });
      it('should create user', () => {
        expect(browser.status).to.be.equal(201);
        expect(browser.text()).to.contain('Your account has been successfully');
      });
    });
  });
});

export default server;