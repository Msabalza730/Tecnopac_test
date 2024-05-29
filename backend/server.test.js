const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('http://localhost:5000');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Server API', () => {
    // Test for GET Method
    describe('GET /api/users', () => {
        it('should return all users', (done) => {
            chai.request(server)
                .get('/api/users')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('array');
                    done();
                });
        });
    });

    // Test for POST Method
    describe('POST /api/users', () => {
        it('should create a new user', (done) => {
            const newUser = {
                username: 'TestUser',
                user_role: 'TestRole',
                status: 'active',
                social_profile: [],
                promote: false,
                rating: 0,
                last_login: new Date()
            };

            chai.request(server)
                .post('/api/users')
                .send(newUser)
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body).to.have.property('id');
                    done();
                });
        });
    });

    // Test for PUT Method
    describe('PUT /api/users/:id', () => {
        it('should update an existing user', (done) => {
            const userId = 1;
            const updatedUser = {
                username: 'UpdatedUser',
                user_role: 'UpdatedRole',
                status: 'inactive',
                social_profile: [],
                promote: true,
                rating: 5,
                last_login: new Date()
            };

            chai.request(server)
                .put(`/api/users/${userId}`)
                .send(updatedUser)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });

    // Test to try DELETE Method
    describe('DELETE /api/users/:id', () => {
        it('should delete an existing user', (done) => {
            const userId = 1;

            chai.request(server)
                .delete(`/api/users/${userId}`)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });
});
