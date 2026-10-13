import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';

test('user can add a product to the cart', async ({ page }) => {
  const home = new HomePage(page);
  const product = new ProductPage(page);
  const cart = new CartPage(page);
  
  // open the first product in the list
  await home.open();
  await home.openFirstProduct();
  const name = await product.getName();
  await product.addToCart();
  await cart.open();

  // the product we added is shown in the cart
  await expect(cart.item(name)).toBeVisible();
});