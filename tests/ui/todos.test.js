const { test, expect } = require('@playwright/test');

test.describe('Todo Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.fill('input[type="text"]', 'testuser');
    await page.fill('input[type="password"]', 'testpass');
    await page.click('button[type="submit"]');
    await page.waitForURL('http://localhost:3000/todos');
  });

  test('should display existing todos', async ({ page }) => {
    const todoItems = await page.$$('ul li');
    expect(todoItems.length).toBeGreaterThan(0);
  });

  test('should add a new todo', async ({ page }) => {
    const newTodoText = 'New test todo';
    await page.fill('input[type="text"]', newTodoText);
    await page.click('button:has-text("Add Todo")');
    
    // Wait for page reload after adding
    await page.waitForURL('http://localhost:3000/todos');
    const todoText = await page.textContent(`ul li:has-text("${newTodoText}")`);
    expect(todoText).toContain(newTodoText);
  });

  test('should toggle todo completion', async ({ page }) => {
    const checkbox = await page.$('ul li input[type="checkbox"]');
    const initialChecked = await checkbox.isChecked();
    
    await checkbox.click();
    const newChecked = await checkbox.isChecked();
    
    expect(newChecked).toBe(!initialChecked);
  });

  test('should delete a todo', async ({ page }) => {
    const initialCount = (await page.$$('ul li')).length;
    await page.click('ul li button:has-text("Delete")');
    
    // Wait for the todo to be removed
    await page.waitForTimeout(500); // Small delay for demo
    const newCount = (await page.$$('ul li')).length;
    
    expect(newCount).toBe(initialCount - 1);
  });
});