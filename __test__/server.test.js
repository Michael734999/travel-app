const app = require('../src/server/index.js');
const supertest = require('supertest');
const request = supertest(app);

it('gets the test endpoint', async() => {
    const res = await request.get('/test');

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('The test passed!');
})