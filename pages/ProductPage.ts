import { Locator, Page } from '@playwright/test';

export class ProductPage {
  readonly productName: Locator;
  readonly addToCartButton: Locator;

  constructor(private readonly page: Page) {
    this.productName = page.locator('[data-test="product-name"]');
    this.addToCartButton = page.locator('[data-test="add-to-cart"]');
  }

  async getName(): Promise<string> {
    return (await this.productName.innerText()).trim();
  }

  async addToCart() {
    await this.addToCartButton.click();
  }
}