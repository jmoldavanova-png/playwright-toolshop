import { test, expect } from '@playwright/test';
import { CatalogPage } from '../pages/CatalogPage';
const isAscending = (values: number[]) => values.every((v, i) => i === 0 || values[i - 1] <= v);
const isDescending = (values: number[]) => values.every((v, i) => i === 0 || values[i - 1] >= v);

test.describe('Catalog', () => {
  let catalog: CatalogPage;

  test.beforeEach(async ({ page }) => {
    catalog = new CatalogPage(page);
    await catalog.open();
  });

  test('search returns only matching products', async () => {
    await catalog.search('Pliers');

    await expect
      .poll(async () => {
        const names = await catalog.getProductNames();
        return names.length > 0 && names.every((n) => /pliers/i.test(n));
      })
      .toBe(true);
  });

  test('search with no matches shows no products', async () => {
    await catalog.search('zzzzzzzz');

    await expect(catalog.productCards).toHaveCount(0);
  });

  test('category filter narrows the product list', async () => {
    await catalog.filterByCategory('Pliers');

    await expect
      .poll(async () => {
        const names = await catalog.getProductNames();
        return names.length > 0 && names.some((n) => /pliers/i.test(n)) && !names.some((n) => /hammer/i.test(n));
      })
      .toBe(true);
  });

  test('pagination shows different products on page 2', async () => {
    const firstPageNames = await catalog.getProductNames();

    await catalog.goToPage(2);

    await expect
      .poll(async () => (await catalog.getProductNames())[0])
      .not.toBe(firstPageNames[0]);
  });
  test('products can be sorted by name A-Z', async () => {
    await catalog.sortBy('Name (A - Z)');

    await expect
      .poll(async () => {
        const names = await catalog.getProductNames();
        const sorted = [...names].sort((a, b) => a.localeCompare(b));
        return names.length > 0 && JSON.stringify(names) === JSON.stringify(sorted);
      })
      .toBe(true);
  });

  test('products can be sorted by price low to high', async () => {
    await catalog.sortBy('Price (Low - High)');

    await expect
      .poll(async () => {
        const prices = await catalog.getProductPrices();
        return prices.length > 0 && isAscending(prices);
      })
      .toBe(true);
  });

  test('products can be sorted by price high to low', async () => {
    await catalog.sortBy('Price (High - Low)');

    await expect
      .poll(async () => {
        const prices = await catalog.getProductPrices();
        return prices.length > 0 && isDescending(prices);
      })
      .toBe(true);
  });
});