import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';

test.describe('Login', () => {
  let loginPage: LoginPage;
  let user: { email: string; password: string };

  test.beforeAll(async ({ browser }) => {
    user = {
      email: `qa.${Date.now()}.${Math.floor(Math.random() * 1000)}@example.com`,
      password: 'Str0ng!Passw0rd#2026',
    };
    const page = await browser.newPage({ baseURL: 'https://practicesoftwaretesting.com' });
    const register = new RegisterPage(page);
    await register.open();
    await register.register(user);
    await expect(page).toHaveURL(/login/);
    await page.close();
  });

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.open();
  });

  test('user cannot log in with a wrong password', async ({ page }) => {
    await loginPage.login('no.such.user@example.com', 'wrong-password');
    await expect(page.getByText(/invalid email or password/i)).toBeVisible();
    await expect(page).toHaveURL(/login/);
  });

   test('user cannot log in with empty fields', async ({ page }) => {
    await loginPage.loginButton.click();
    await expect(page).toHaveURL(/login/);
  });

  test('user can log in with valid credentials', async ({ page }) => {
    await loginPage.login(user.email, user.password);
    await expect(page).toHaveURL(/account/);
  });
});