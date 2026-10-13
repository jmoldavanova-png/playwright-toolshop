import { Locator, Page, expect } from '@playwright/test';

const toNumber = (text: string) => Number(text.replace(/[^0-9.]/g, ''));

export class CartPage {
  readonly rows: Locator;

  constructor(private readonly page: Page) {
    // product rows are the rows that contain a quantity input
    this.rows = page.getByRole('row').filter({ has: page.getByRole('spinbutton') });
  }

  async open() {
    await this.page.locator('[data-test="nav-cart"]').click();
  }

  item(name: string): Locator {
    return this.page.getByText(name).first();
  }

  async getItemNames(): Promise<string[]> {
    return (await this.rows.locator('td:first-child').allInnerTexts()).map((n) => n.trim());
  }

  async getUnitPrice(index: number): Promise<number> {
    return toNumber(await this.rows.nth(index).locator('td').nth(2).innerText());
  }

  async getLineTotal(index: number): Promise<number> {
    return toNumber(await this.rows.nth(index).locator('td').nth(3).innerText());
  }

  async getCartTotal(): Promise<number> {
    return toNumber(await this.page.getByRole('row').last().innerText());
  }

  async setQuantity(index: number, quantity: number) {
    const input = this.rows.nth(index).getByRole('spinbutton');
    await input.fill(String(quantity));
    await input.press('Tab');
  }

  async expectCartBadge(count: number) {
    await expect(this.page.locator('[data-test="nav-cart"]')).toContainText(String(count));
  }

  async removeItem(index: number) {
    await this.rows.nth(index).locator('td').last().locator('button, a, .btn').first().click();
  }
}