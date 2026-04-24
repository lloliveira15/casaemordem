const request = require('supertest');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const API_URL = 'http://localhost:3000';
const JWT_SECRET = process.env.JWT_SECRET || 'test-secret';

describe('Auth API', () => {
  let token;
  let testUser = { id: 1, username: 'TestUser', email: 'test@example.com', password: '123456', household_id: 1 };

  describe('POST /auth/register', () => {
    it('should register a new user or reject if exists', async () => {
      const res = await request(API_URL)
        .post('/auth/register')
        .send({ username: 'NewUser', email: 'new2@example.com', password: '123456' });
      
      expect([200, 201, 400]).toContain(res.status);
      if (res.status !== 400) {
        expect(res.body).toHaveProperty('token');
      }
    });
  });

  describe('POST /auth/login', () => {
    it('should login with valid credentials', async () => {
      const res = await request(API_URL)
        .post('/auth/login')
        .send({ email: 'new@example.com', password: '123456' });
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should reject invalid password', async () => {
      const res = await request(API_URL)
        .post('/auth/login')
        .send({ email: 'new@example.com', password: 'wrong' });
      
      expect(res.status).toBe(401);
    });
  });
});

describe('Tasks API', () => {
  let authToken;

  beforeAll(async () => {
    const res = await request(API_URL)
      .post('/auth/login')
      .send({ email: 'new@example.com', password: '123456' });
    authToken = res.body.token;
  });

  describe('GET /api/tasks', () => {
    it('should get tasks for a date', async () => {
      const res = await request(API_URL)
        .get('/api/tasks?date=2024-01-01')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const res = await request(API_URL)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ description: 'Test task', due_date: '2024-01-01', room: 'Cozinha' });
      
      expect([200, 201]).toContain(res.status);
    });
  });

  describe('PUT /api/tasks/:id/toggle', () => {
    it('should toggle task completion', async () => {
      const createRes = await request(API_URL)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ description: 'Toggle test', due_date: '2024-01-01' });
      
      const taskId = createRes.body.id;
      const toggleRes = await request(API_URL)
        .put(`/api/tasks/${taskId}/toggle`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(toggleRes.status).toBe(200);
    });
  });
});

describe('Templates API', () => {
  let authToken;

  beforeAll(async () => {
    const res = await request(API_URL)
      .post('/auth/login')
      .send({ email: 'new@example.com', password: '123456' });
    authToken = res.body.token;
  });

  describe('GET /api/templates', () => {
    it('should get all templates', async () => {
      const res = await request(API_URL)
        .get('/api/templates')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('POST /api/templates', () => {
    it('should create a new template', async () => {
      const res = await request(API_URL)
        .post('/api/templates')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ description: 'Test template', room: 'Cozinha', frequency: 'daily' });
      
      expect([200, 201]).toContain(res.status);
    });
  });
});

describe('Household API', () => {
  let authToken;

  beforeAll(async () => {
    const res = await request(API_URL)
      .post('/auth/login')
      .send({ email: 'new@example.com', password: '123456' });
    authToken = res.body.token;
  });

  describe('GET /api/household', () => {
    it('should get household info', async () => {
      const res = await request(API_URL)
        .get('/api/household')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.status).toBe(200);
    });
  });

  describe('POST /api/household/generate-code', () => {
    it('should generate new invite code', async () => {
      const res = await request(API_URL)
        .post('/api/household/generate-code')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('invite_code');
    });
  });
});