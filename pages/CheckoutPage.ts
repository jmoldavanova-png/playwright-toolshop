import { Page } from '@playwright/test';

export type Address = {
  country: string;
  postalCode: string;
  houseNumber: string;
  street: string;
  city: string;
  state: string;
};

export type Card = {
  number: string;
  expiry: string; // MM/YYYY
  cvv: string;
  holder: string;
};

export class CheckoutPage {
  constructor(private readonly page: Page) {}

  private field(name: string) {
    return this.page.locator(`[data-test="${name}"]`);
  }

  async proceedFromCart() {
    await this.field('proceed-1').click();
  }

  async confirmSignedIn() {
    await this.field('proceed-2').click();
  }

  async fillBillingAddress(a: Address) {
    await this.field('country').selectOption({ label: a.country });
    await this.field('postal_code').fill(a.postalCode);
    await this.field('house_number').fill(a.houseNumber);
    await this.field('street').fill(a.street);
    await this.field('city').fill(a.city);
    await this.field('state').fill(a.state);
    await this.field('proceed-3').click();
  }

  async payByCard(c: Card) {
    await this.field('payment-method').selectOption('credit-card');
    await this.field('credit_card_number').fill(c.number);
    await this.field('expiration_date').fill(c.expiry);
    await this.field('cvv').fill(c.cvv);
    await this.field('card_holder_name').fill(c.holder);
  }

  async confirm() {
    await this.field('finish').click();
  }
}