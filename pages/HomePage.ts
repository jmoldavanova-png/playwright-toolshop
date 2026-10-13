import { Page } from '@playwright/test';

export class HomePage {
  constructor(private readonly page: Page) {}

  async open() {
    await this.page.goto('/');
  }

  async openFirstProduct() {
    await this.page.locator('a.card').first().click();
  }
}