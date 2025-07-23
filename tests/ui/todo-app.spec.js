const { test, expect } = require('@playwright/test');

// Test data
const TEST_USER = {
  username: 'testuser',
  password: 'testpass'
};

test.describe('Todo App E2E Tests', () => {
  let page;
  
  test.beforeAll(async ({ browser }) => {
    // Launch browser once before all tests
    page = await browser.newPage();
    await page.goto('http://localhost:3000');
  });

  test.beforeEach(async () => {
    // Clear storage before each test
    await page.context().clearCookies();
    await page.goto('http://localhost:3000');
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('should login successfully with valid credentials', async () => {
    // Fill login form
    await page.fill('input[type="text"]', TEST_USER.username);
    await page.fill('input[type="password"]', TEST_USER.password);
    
    // Click login and wait for navigation
    await Promise.all([
      page.waitForNavigation({ url: 'http://localhost:3000/todos' }),
      page.click('button[type="submit"]')
    ]);
    
    // Verify successful login
    await expect(page.locator('button:has-text("Logout")')).toBeVisible();
  });

  test('should show error with invalid credentials', async () => {
    // Fill with wrong password
    await page.fill('input[type="text"]', TEST_USER.username);
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    // Verify error message
    await expect(page.locator('p[style*="color: red"]')).toHaveText('Invalid credentials');
  });

  test('should create, update, and delete a todo', async () => {
    // Login first
    await page.fill('input[type="text"]', TEST_USER.username);
    await page.fill('input[type="password"]', TEST_USER.password);
    await Promise.all([
      page.waitForNavigation({ url: 'http://localhost:3000/todos' }),
      page.click('button[type="submit"]')
    ]);

    // Create new todo
    const todoText = 'Test todo ' + Date.now();
    await page.fill('input[placeholder="Enter todo title"]', todoText);
    await page.click('button:has-text("Add Todo")');
    
    // Verify todo appears
    const todoItem = page.locator(`li:has-text("${todoText}")`);
    await expect(todoItem).toBeVisible();

    // Toggle completion
    const checkbox = todoItem.locator('input[type="checkbox"]');
    await checkbox.click();
    await expect(checkbox).toBeChecked();

    // Delete todo
    await todoItem.locator('button:has-text("Delete")').click();
    await expect(todoItem).not.toBeVisible();
  });
});