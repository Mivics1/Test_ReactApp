const { test, expect } = require('@playwright/test');

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();
    await page.goto('http://localhost:3000/login');
  });

test('should login with valid credentials', async ({ page }) => {
  // Intercept the API request
  const loginRequest = page.waitForRequest('**/api/login');
  
  await page.fill('input[type="text"]', 'testuser');
  await page.fill('input[type="password"]', 'testpass');
  await page.click('button[type="submit"]');
  
  // Wait for the request to complete
  const request = await loginRequest;
  const response = await request.response();
  
  // Verify the response
  expect(response.status()).toBe(200);
  
  // Verify navigation
  await page.waitForURL('http://localhost:3000/todos');
});

  test('should show error with invalid credentials', async ({ page }) => {
    await page.fill('input[type="text"]', 'testuser');
    await page.fill('input[type="password"]', 'wrongpass');
    await page.click('button[type="submit"]');
    
    const errorMessage = await page.textContent('p[style*="color: red"]');
    expect(errorMessage).toContain('Invalid credentials');
  });
});