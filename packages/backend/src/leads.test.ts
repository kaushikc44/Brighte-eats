import { describe, it, expect, afterAll } from 'vitest';
import request from 'supertest';

// We need to import the app. Since index.ts calls app.listen,
// we'll import the express app separately.
// For now, test against the running server or create a test helper.
// Since the server is already structured with index.ts calling listen(),
// let's test via HTTP against the local server.

const API = 'http://localhost:3003';

describe('Leads API', () => {
  const testLead = {
    name: 'Test User',
    email: 'test@example.com',
    mobile: '0400000000',
    postcode: '2000',
    service: ['delivery']
  };

  let createdId: number;

  // Test 1: Happy path — create a lead returns 201
  it('POST /leads — creates a lead with valid data', async () => {
    const res = await request(API)
      .post('/leads')
      .send(testLead)
      .expect(201);

    expect(res.body).toHaveProperty('message', 'Lead created successfully');
  });

  // Test 2: Validation error — missing required fields returns 400
  it('POST /leads — returns 400 for missing required fields', async () => {
    const res = await request(API)
      .post('/leads')
      .send({ name: 'Incomplete' })
      .expect(400);

    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors).toHaveProperty('email');
    expect(res.body.errors).toHaveProperty('mobile');
    expect(res.body.errors).toHaveProperty('postcode');
    expect(res.body.errors).toHaveProperty('service');
  });

  // Test 3: GET /leads returns leads that were created
  it('GET /leads — returns list of leads', async () => {
    const res = await request(API)
      .get('/leads')
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);

    const created = res.body.find((l: any) => l.email === 'test@example.com');
    expect(created).toBeDefined();
    expect(created.name).toBe('Test User');
    createdId = created.id;
  });

  // Cleanup
  afterAll(async () => {
    if (createdId) {
      await request(API).delete(`/leads/${createdId}`);
    }
  });
});
