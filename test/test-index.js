import {chai, server} from './test-setuo';

describe('test index', () => {
    it('should return welcome to author\'s heaven', (done) => {
        chai.request(server)
        .get('/')
        .end((error, res) => {
            res.status.should.eql(200);
            res.body.data.should.eql('Welcome to Authors Haven.');
            done();
        })
    })
})