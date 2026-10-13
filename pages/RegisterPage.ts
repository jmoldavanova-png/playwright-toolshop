import { Page } from '@playwright/test';

export class RegisterPage {
  constructor(private readonly page: Page) {}

  async open() {
    await this.page.goto('/auth/register');
  }

  async register(u: { email: string; password: string }) {
    const p = this.page;
    await p.getByLabel('First name', { exact: true }).fill('Test');
    await p.getByLabel('Last name', { exact: true }).fill('User');
    await p.getByLabel('Date of Birth').fill('1990-01-01');
    await p.getByLabel('Country').selectOption({ label: 'Australia' });
    await p.getByLabel('Postal code').fill('2000');
    await p.getByLabel('House number').fill('1');
    await p.getByLabel('Street', { exact: true }).fill('George St');
    await p.getByLabel('City', { exact: true }).fill('Sydney');
    await p.getByLabel('State', { exact: true }).fill('NSW');
    await p.getByLabel('Phone').fill('0412345678');
    await p.getByLabel('Email address').fill(u.email);
    await p.getByLabel('Password', { exact: true }).fill(u.password);
    await p.getByRole('button', { name: 'Register' }).click();
  }
}