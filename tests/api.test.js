process.env.JWT_SECRET = 'test-secret';
process.env.DB_PATH = ':memory:';

const request = require('supertest');
const app = require('../server/app');

let testToken;

beforeAll(async () => {
  const res = await request(app)
    .post('/auth/register')
    .send({ username: 'TestUser', email: 'testuser@example.com', password: '123456' });
  testToken = res.body.token;
});

describe('Auth API', () => {
  describe('POST /auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({ username: 'NewUser', email: 'newuser@example.com', password: '123456' });
      
      expect([200, 201]).toContain(res.status);
      if (res.status !== 400) {
        expect(res.body).toHaveProperty('token');
      }
    });
  });

  describe('POST /auth/login', () => {
    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({ email: 'testuser@example.com', password: '123456' });
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should reject invalid password', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({ email: 'testuser@example.com', password: 'wrong' });
      
      expect(res.status).toBe(401);
    });
  });
});

describe('Tasks API', () => {
  let authToken;

  beforeAll(async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'testuser@example.com', password: '123456' });
    authToken = res.body.token;
  });

  describe('GET /api/tasks', () => {
    it('should get tasks for a date', async () => {
      const res = await request(app)
        .get('/api/tasks?date=2024-01-01')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ description: 'Test task', due_date: '2024-01-01', room: 'Cozinha' });
      
      expect([200, 201]).toContain(res.status);
    });

    it('should reject duplicate task on same date', async () => {
      await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ description: 'Duplicate me', due_date: '2024-06-01' });

      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ description: 'Duplicate me', due_date: '2024-06-01' });

      expect(res.status).toBe(409);
      expect(res.body.error).toContain('já existe');
    });
  });

  describe('PUT /api/tasks/:id/toggle', () => {
    it('should toggle task completion', async () => {
      const createRes = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ description: 'Toggle test', due_date: '2024-01-01' });
      
      const taskId = createRes.body.id;
      const toggleRes = await request(app)
        .put(`/api/tasks/${taskId}/toggle`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(toggleRes.status).toBe(200);
    });
  });
});

describe('Templates API', () => {
  let authToken;

  beforeAll(async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'testuser@example.com', password: '123456' });
    authToken = res.body.token;
  });

  describe('GET /api/templates', () => {
    it('should get all templates', async () => {
      const res = await request(app)
        .get('/api/templates')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('POST /api/templates', () => {
    it('should create a new template', async () => {
      const res = await request(app)
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
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'testuser@example.com', password: '123456' });
    authToken = res.body.token;
  });

  describe('GET /api/household', () => {
    it('should get household info', async () => {
      const res = await request(app)
        .get('/api/household')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.status).toBe(200);
    });
  });

  describe('POST /api/household/generate-code', () => {
    it('should generate new invite code', async () => {
      const res = await request(app)
        .post('/api/household/generate-code')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('invite_code');
    });
  });
});
