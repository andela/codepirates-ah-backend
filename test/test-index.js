import {chai, app} from './test-setuo';

describe('test index', () => {
    it('should return welcome to author\'s heaven', (done) => {
        chai.request(app)
        .get('/')
        .end((error, res) => {
            res.status.should.eql(200);
            res.body.message.should.eql('Welcome to Authors Haven.');
            done();
        })
    })
})