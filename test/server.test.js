const assert = require('assert');
const request = require('supertest');
const app = require('../server');

describe('/probe', () => {
    it('should return 200 status code', async () => {
        await request(app)
            .get('/probe')
            .expect(200);
    });
});