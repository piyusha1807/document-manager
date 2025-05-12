import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import axios from 'axios';
import { loginAPI } from '@/lib/services/authService';

// Define the type for login request
type LoginRequestBody = {
  email: string;
  password: string;
};

// Setup mock server
const server = setupServer(
  http.post('/auth/login', async ({ request }) => {
    const body = await request.json() as LoginRequestBody;
    
    // Test valid credentials
    if (body.email === 'admin@example.com' && body.password === 'password') {
      return HttpResponse.json({
        id: '1',
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin'
      }, { status: 200 });
    }
    
    // Test invalid credentials
    return new HttpResponse(JSON.stringify({ error: 'Invalid credentials' }), { 
      status: 401, 
      headers: { 'Content-Type': 'application/json' } 
    });
  })
);

// Setup and teardown
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Mock axios to point to our mock server
jest.mock('@/lib/axios', () => {
  const originalModule = jest.requireActual('axios');
  return {
    __esModule: true,
    ...originalModule,
    default: {
      post: jest.fn().mockImplementation((url, data) => {
        return axios.post(url, data); // Using the real axios to call our mock server
      })
    }
  };
});

describe('Login API', () => {
  test('returns user data on successful login', async () => {
    const result = await loginAPI('admin@example.com', 'password');
    
    expect(result).toEqual({
      id: '1',
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin'
    });
  });
  
  test('throws error on invalid credentials', async () => {
    await expect(loginAPI('wrong@example.com', 'wrongpassword'))
      .rejects.toThrow();
  });
  
  test('throws error on network failure', async () => {
    // Temporarily override the handler to simulate a network error
    server.use(
      http.post('/auth/login', () => {
        return HttpResponse.error();
      })
    );
    
    await expect(loginAPI('admin@example.com', 'password'))
      .rejects.toThrow();
  });
  
  test('throws error on server failure', async () => {
    // Temporarily override the handler to simulate a server error
    server.use(
      http.post('/auth/login', () => {
        return new HttpResponse(JSON.stringify({ error: 'Internal server error' }), { 
          status: 500, 
          headers: { 'Content-Type': 'application/json' } 
        });
      })
    );
    
    await expect(loginAPI('admin@example.com', 'password'))
      .rejects.toThrow();
  });
}); 