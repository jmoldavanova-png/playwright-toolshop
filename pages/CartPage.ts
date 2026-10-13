import { Locator, Page } from '@playwright/test';

export class CartPage {
  constructor(private readonly page: Page) {}

  async open() {
    await this.page.locator('[data-test="nav-cart"]').click();
  }

  item(name: string): Locator {
    return this.page.getByText(name).first();
  }
}