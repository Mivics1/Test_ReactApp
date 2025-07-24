const { test, expect } = require('@playwright/test');

// Test data
const TEST_USER = {
  username: 'testuser',
  password: 'testpass'
};

test.describe.configure({ mode: 'serial' }); // Run tests in sequence

test.describe('Todo App UI Tests', () => {
  let page;
  let testTodoId = `test-todo-${Date.now()}`;
  let testTodoText = `Test Todo ${testTodoId}`;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto('http://localhost:3000');
  });

  test.afterAll(async () => {
    await page.close();
  });

  /* SCENARIO 1: Login with valid/invalid credentials */
  test('should fail login with invalid credentials', async () => {
    await page.fill('input[type="text"]', 'invaliduser');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('p[style*="color: red"]')).toHaveText(/Invalid credentials|Login failed/i);
    await expect(page).toHaveURL('http://localhost:3000/login');
  });

  test('should login successfully with valid credentials', async () => {
    await page.fill('input[type="text"]', TEST_USER.username);
    await page.fill('input[type="password"]', TEST_USER.password);
    
    await Promise.all([
      page.waitForURL('http://localhost:3000/todos'),
      page.click('button[type="submit"]')
    ]);
    
    await expect(page.locator('text=Your Todos')).toBeVisible();
  });

  /* SCENARIO 2: Creating a new todo */
  test('should create a new todo item', async () => {
    await page.fill('input[placeholder="Enter todo title"]', testTodoText);
    
    const [response] = await Promise.all([
      page.waitForResponse(res => 
        res.url().includes('/todos') && res.request().method() === 'POST'
      ),
      page.click('button:has-text("Add Todo")')
    ]);
    
    expect(response.status()).toBe(201);
    await expect(page.locator(`li:has-text("${testTodoText}")`)).toBeVisible();
  });


  // /* SCENARIO 3: Editing an existing item */
  // test('should edit an existing todo', async () => {
  //   const updatedText = `${testTodoText} UPDATED`;
  //   const todoItem = page.locator(`li:has-text("${testTodoText}")`).first();
    
  //   await todoItem.locator('button:has-text("Edit")').click();
  //   await page.fill('input[placeholder="Edit todo"]', updatedText);
    
  //   const [response] = await Promise.all([
  //     page.waitForResponse(res => 
  //       res.url().includes('/todos/') && res.request().method() === 'PUT'
  //     ),
  //     page.click('button:has-text("Save")')
  //   ]);
    
  //   expect(response.status()).toBe(200);
  //   await expect(page.locator(`li:has-text("${updatedText}")`)).toBeVisible();
  // });

  /* SCENARIO 4: Deleting an item */
  test('should delete a todo item', async () => {
    const todoItem = page.locator(`li:has-text("${testTodoText}")`).first();
    const initialCount = await page.locator('li').count();
    
    const [response] = await Promise.all([
      page.waitForResponse(res => 
        res.url().includes('/todos/') && res.request().method() === 'DELETE'
      ),
      todoItem.locator('button:has-text("Delete")').click()
    ]);
    
    expect(response.status()).toBe(204);
    await expect(page.locator('li')).toHaveCount(initialCount - 1);
  });

  /* SCENARIO 5: Asserting presence of expected data */
  test('should display all expected UI elements after actions', async () => {
    // Verify todos list exists
    await expect(page.locator('text=Your Todos')).toBeVisible();
    
    // Verify todo form exists
    await expect(page.locator('input[placeholder="Enter todo title"]')).toBeVisible();
    await expect(page.locator('button:has-text("Add Todo")')).toBeVisible();
    
    // Verify at least one todo exists
    const todos = await page.locator('li').count();
    expect(todos).toBeGreaterThan(0);
    
    // Verify each todo has expected elements
    const firstTodo = page.locator('li').first();
    await expect(firstTodo.locator('input[type="checkbox"]')).toBeVisible();
    await expect(firstTodo.locator('button:has-text("Edit")')).toBeVisible();
    await expect(firstTodo.locator('button:has-text("Delete")')).toBeVisible();
  });
});