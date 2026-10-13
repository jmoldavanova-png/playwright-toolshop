import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { CatalogPage } from '../pages/CatalogPage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';

test('user can add a product to the cart', async ({ page }) => {
  const home = new HomePage(page);
  const product = new ProductPage(page);
  const cart = new CartPage(page);

  await home.open();
  await home.openFirstProduct();
  const name = await product.getName();
  await product.addToCart();
  await cart.open();
  await expect(cart.item(name)).toBeVisible();
});

test.describe('Cart', () => {
  let catalog: CatalogPage;
  let product: ProductPage;
  let cart: CartPage;

  test.beforeEach(({ page }) => {
    catalog = new CatalogPage(page);
    product = new ProductPage(page);
    cart = new CartPage(page);
  });

  // adds the first `count` different products from the catalog to the cart
  async function addProducts(count: number) {
    for (let i = 0; i < count; i++) {
      await catalog.open();
      await catalog.openProduct(i);
      await product.addToCart();
      await cart.expectCartBadge(i + 1);
    }
  }

  test('cart total equals the sum of line totals', async () => {
    await addProducts(2);
    await cart.open();

    await expect(cart.rows).toHaveCount(2);
    const lineTotals = [await cart.getLineTotal(0), await cart.getLineTotal(1)];
    expect(await cart.getCartTotal()).toBeCloseTo(lineTotals[0] + lineTotals[1], 2);
  });

  test('changing quantity updates line total and cart total', async () => {
    await addProducts(1);
    await cart.open();
    const unitPrice = await cart.getUnitPrice(0);

    await cart.setQuantity(0, 3);

    await expect.poll(() => cart.getLineTotal(0)).toBeCloseTo(unitPrice * 3, 2);
    await expect.poll(() => cart.getCartTotal()).toBeCloseTo(unitPrice * 3, 2);
  });

  test('user can remove a product from the cart', async () => {
    await addProducts(2);
    await cart.open();
    await expect(cart.rows).toHaveCount(2);
    const names = await cart.getItemNames();
    await cart.removeItem(0);

    await expect(cart.rows).toHaveCount(1);
    expect(await cart.getItemNames()).toEqual([names[1]]);
    await expect.poll(() => cart.getCartTotal()).toBeCloseTo(await cart.getLineTotal(0), 2);
  });
});