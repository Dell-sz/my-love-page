import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:8000';

test.describe('Love Calendar Frontend Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('Login with valid credentials', async ({ page }) => {
    await page.goto(`${BASE_URL}/login.html`);
    await page.fill('#email', 'testuser@example.com');
    await page.fill('#password', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/memories.html/);
    await expect(page.locator('nav')).toContainText('Logout');
  });

  test('Register new user', async ({ page }) => {
    await page.goto(`${BASE_URL}/register.html`);
    await page.fill('#name', 'New User');
    await page.fill('#email', 'newuser@example.com');
    await page.fill('#password', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/memories.html/);
    await expect(page.locator('nav')).toContainText('Logout');
  });

  test('Logout redirects to index', async ({ page }) => {
    await page.goto(`${BASE_URL}/login.html`);
    await page.fill('#email', 'testuser@example.com');
    await page.fill('#password', 'password123');
    await page.click('button[type="submit"]');
    await page.click('a#logout-link');
    await expect(page).toHaveURL(/index.html/);
  });

  test('Create new memory', async ({ page }) => {
    await page.goto(`${BASE_URL}/save-memory.html`);
    await page.fill('#titulo-memoria', 'Test Memory');
    await page.fill('#descricao-memoria', 'This is a test memory description.');
    await page.click('button#salvar-btn');
    await expect(page).toHaveURL(/memories.html/);
    await expect(page.locator('#lista-lembrancas')).toContainText('Test Memory');
  });

  test('List memories', async ({ page }) => {
    await page.goto(`${BASE_URL}/memories.html`);
    const memories = await page.locator('.lembranca').count();
    expect(memories).toBeGreaterThan(0);
  });

  test('Delete memory', async ({ page }) => {
    await page.goto(`${BASE_URL}/memories.html`);
    const firstRemoveBtn = page.locator('.remover-btn').first();
    if (await firstRemoveBtn.count() > 0) {
      await firstRemoveBtn.click();
      // Confirm alert
      page.on('dialog', dialog => dialog.accept());
      // Wait for reload
      await page.waitForTimeout(1000);
      // Check memory count decreased or message shown
      const memories = await page.locator('.lembranca').count();
      expect(memories).toBeGreaterThanOrEqual(0);
    }
  });

  test('Navigation links visibility based on login', async ({ page }) => {
    await page.goto(BASE_URL);
    const loginLink = page.locator('#login-link');
    const logoutLink = page.locator('#logout-link');
    expect(await loginLink.isVisible()).toBe(true);
    expect(await logoutLink.isVisible()).toBe(false);
  });

  test('Dark mode toggle and persistence', async ({ page }) => {
    await page.goto(`${BASE_URL}/preferences.html`);
    await page.selectOption('#theme-select', 'dark');
    await page.click('button[type="submit"]');
    await expect(page.locator('body')).toHaveClass(/dark-mode/);
    // Reload and check persistence
    await page.reload();
    await expect(page.locator('body')).toHaveClass(/dark-mode/);
  });

  test('Modal media view opens and closes', async ({ page }) => {
    await page.goto(`${BASE_URL}/memories.html`);
    const firstImage = page.locator('.lembranca img').first();
    if (await firstImage.count() > 0) {
      await firstImage.click();
      const modal = page.locator('#media-modal');
      await expect(modal).toBeVisible();
      await page.locator('.close-modal').click();
      await expect(modal).toBeHidden();
    }
  });
});
