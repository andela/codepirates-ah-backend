import sinon from 'sinon';
import { expect } from './test-setup';
import Article from '../src/controllers/articles.controller';
import OpenUrlHelper from '../src/helpers/share.article.helper';

describe('test for sharing an article', () => {
  it('test for sharing an article via facebook', async () => {
    const req = {
      params: { slug: 'fakeslug', channel: 'facebook' },
      auth: {
        email: 'user@gmail.com'
      }
    };
    const res = {
      status() { },
      send() { },
      json() { }
    };
    sinon.stub(res, 'status').returnsThis();
    sinon.stub(OpenUrlHelper, 'openUrl').returns(true);
    await Article.shareArticle(req, res);
    expect(res.status).to.have.been.calledWith(200);
  });
  it('test for sharing an article via twitter', async () => {
    const req = {
      params: { slug: 'fakeslug', channel: 'twitter' },
      auth: {
        email: 'user@gmail.com'
      }
    };
    const res = {
      status() { },
      send() { },
      json() { }
    };
    sinon.stub(res, 'status').returnsThis();
    await Article.shareArticle(req, res);
    expect(res.status).to.have.been.calledWith(200);
  });
  it('test for sharing an article via mail', async () => {
    const req = {
      params: { slug: 'fakeslug', channel: 'twitter' },
      auth: {
        email: 'user@gmail.com'
      }
    };
    const res = {
      status() { },
      send() { },
      json() { }
    };
    sinon.stub(res, 'status').returnsThis();
    await Article.shareArticle(req, res);
    expect(res.status).to.have.been.calledWith(200);
  });
});
