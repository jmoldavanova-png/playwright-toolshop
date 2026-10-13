import { test as base, expect, Page } from '@playwright/test';
import { RegisterPage } from '../pages/RegisterPage';
import { LoginPage } from '../pages/LoginPage';

type Account = { email: string; password: string };

export const test = base.extend<{ loggedInPage: Page }, { account: Account }>({
  account: [
    async ({ browser }, use) => {
      const account = {
        email: `qa.${Date.now()}.${Math.floor(Math.random() * 1000)}@example.com`,
        password: 'Str0ng!Passw0rd#2026',
      };
      const page = await browser.newPage({ baseURL: 'https://practicesoftwaretesting.com' });
      const register = new RegisterPage(page);
      await register.open();
      await register.register(account);
      await expect(page).toHaveURL(/login/);
      await page.close();
      await use(account);
    },
    { scope: 'worker' },
  ],

  loggedInPage: async ({ page, account }, use) => {
    const login = new LoginPage(page);
    await login.open();
    await login.login(account.email, account.password);
    await expect(page).toHaveURL(/account/);
    await use(page);
  },
});

export { expect };