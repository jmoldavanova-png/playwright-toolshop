import { test, expect } from '../fixtures/fixtures';
import { CatalogPage } from '../pages/CatalogPage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

const address = {
  country: 'Australia',
  postalCode: '2113',
  houseNumber: '67',
  street: 'Alexys Driveway',
  city: 'Maximusfort',
  state: 'New South Wales',
};

const card = {
  number: '7890-9809-0908-6788',
  expiry: '12/2030',
  cvv: '768',
  holder: 'Test Test',
};

test.describe('Checkout', () => {
  test('logged-in user can pay for an order by credit card', async ({ loggedInPage: page }) => {
    const catalog = new CatalogPage(page);
    const product = new ProductPage(page);
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);

    await catalog.open();
    await catalog.openProduct(0);
    await product.addToCart();
    await cart.expectCartBadge(1);
    await cart.open();

    await checkout.proceedFromCart();
    await checkout.confirmSignedIn();
    await checkout.fillBillingAddress(address);
    await checkout.payByCard(card);
    await checkout.confirm();

    await expect(page.getByText(/payment was successful/i)).toBeVisible();
  });
});