import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { testUser } from '../test-data/user';

test.describe('Login', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.open();
  });

  test('user cannot log in with a wrong password', async ({ page }) => {
    await loginPage.login(testUser.email, 'wrong-password');
    await expect(page.getByText(/invalid email or password/i)).toBeVisible();
    await expect(page).toHaveURL(/login/);
  });

  test('user cannot log in with empty fields', async ({ page }) => {
    await loginPage.loginButton.click();
    await expect(page).toHaveURL(/login/);
  });

  test('user can log in with valid credentials', async ({ page }) => {
    await loginPage.login(testUser.email, testUser.password);
    await expect(page).toHaveURL(/account/);
  });
});