const request = require('supertest');
const app = require('../server');

describe('/', () => {
    describe('users', () => {
        it('on a get request should return a 200 status code', async () => {
            await request(app)
                .get('/users')
                .expect(200);
        });

        it('on a get request should return a json response and 200 status code', async () => {
            await request(app)
                .get('/users')
                .expect('Content-Type', /json/)
                .expect(200);
        });


        describe('/:id', () => {
            it('on a get request should return a single user in json format', async () => {
                await request(app)
                    .get('/users/103')
                    .expect('Content-Type', /json/)
                    .expect(200);
            })
        })
    })


});