import { Locator, Page, expect } from '@playwright/test';

export class CatalogPage {
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly sortSelect: Locator;
  readonly productCards: Locator;
  readonly productNames: Locator;
  readonly productPrices: Locator;

  constructor(private readonly page: Page) {
    this.searchInput = page.getByPlaceholder('Search', { exact: true });
    this.searchButton = page.getByRole('button', { name: 'Search', exact: true });
    this.sortSelect = page.getByRole('combobox').first();
    this.productCards = page.locator('a.card');
    this.productNames = page.locator('[data-test="product-name"]');
    this.productPrices = page.locator('[data-test="product-price"]');
  }

  async open() {
    await this.page.goto('/');
    await expect(this.productCards.first()).toBeVisible();
  }

  async search(term: string) {
    await this.searchInput.fill(term);
    await this.searchButton.click();
  }

  async filterByCategory(name: string) {
    await this.page.getByRole('checkbox', { name, exact: true }).check();
  }

  async sortBy(option: string) {
    await this.sortSelect.selectOption({ label: option });
  }

  async goToPage(pageNumber: number) {
    await this.page
      .locator('.page-link', { hasText: new RegExp(`^${pageNumber}$`) })
      .click();
}

  async getProductNames(): Promise<string[]> {
    return (await this.productNames.allInnerTexts()).map((n) => n.trim());
  }

  async getProductPrices(): Promise<number[]> {
    const texts = await this.productPrices.allInnerTexts();
    return texts.map((t) => Number(t.replace(/[^0-9.]/g, '')));
  }
}