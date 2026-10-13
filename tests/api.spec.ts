import { test, expect } from '../fixtures/fixtures';

const API = 'https://api.practicesoftwaretesting.com';

test.describe('API', () => {
  test('GET /products returns a paginated list of products', async ({ request }) => {
    const res = await request.get(`${API}/products`);
    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);
    expect(body.data[0]).toHaveProperty('id');
    expect(body.data[0]).toHaveProperty('name');
    expect(body.data[0]).toHaveProperty('price');
  });

  test('GET /products/{id} returns the same product as the list', async ({ request }) => {
    const list = await (await request.get(`${API}/products`)).json();
    const first = list.data[0];

    const res = await request.get(`${API}/products/${first.id}`);
    expect(res.status()).toBe(200);

    const product = await res.json();
    expect(product.id).toBe(first.id);
    expect(product.name).toBe(first.name);
  });

  test('GET /products/{id} with an unknown id returns an error', async ({ request }) => {
    const res = await request.get(`${API}/products/does-not-exist`);
    expect(res.status()).toBeGreaterThanOrEqual(400);
  });

  test('GET /categories returns a non-empty list', async ({ request }) => {
    const res = await request.get(`${API}/categories`);
    expect(res.status()).toBe(200);
    expect((await res.json()).length).toBeGreaterThan(0);
  });

  test('POST /users/login returns a token for a valid user', async ({ request, account }) => {
    const res = await request.post(`${API}/users/login`, {
      data: { email: account.email, password: account.password },
    });
    expect(res.status()).toBe(200);
    expect((await res.json()).access_token).toBeTruthy();
  });

  test('POST /users/login rejects a wrong password', async ({ request, account }) => {
    const res = await request.post(`${API}/users/login`, {
      data: { email: account.email, password: 'Wrong!Pass123' },
    });
    expect(res.status()).toBe(401);
  });
});