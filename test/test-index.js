<<<<<<< HEAD
import {chai, server, expect} from './test-setuo';
=======
import {chai, server} from './test-setuo';
>>>>>>> rename imported server

describe('test index', () => {
    it('should return welcome to author\'s heaven', (done) => {
        chai.request(server)
        .get('/')
        .end((error, res) => {
            expect(res.status).to.be.equal(200);
            expect(res.body).to.have.property("data");
            done();
        })
    })
})