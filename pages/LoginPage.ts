import { Locator, Page } from '@playwright/test';

export class LoginPage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(private readonly page: Page) {
    this.emailInput = page.getByPlaceholder('Your email');
    this.passwordInput = page.getByPlaceholder('Your password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
  }

  async open() {
    await this.page.goto('/');
    await this.page.getByRole('link', { name: 'Sign in' }).click();
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}