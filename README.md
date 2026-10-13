# Playwright Toolshop

![Playwright Tests](https://github.com/jmoldavanova-png/playwright-toolshop/actions/workflows/playwright.yml/badge.svg)

End-to-end and API test automation for the demo web shop [Practice Software Testing](https://practicesoftwaretesting.com).

Built with **Playwright**, **TypeScript**, the **Page Object** pattern and **GitHub Actions** CI.

## What is covered

| Area | Scenarios |
|------|-----------|
| Login | valid login; wrong password; non-existent user; empty fields |
| Catalog | search; search with no results; filter by category; pagination; sort by name (A–Z) and price (low–high, high–low) |
| Cart | add product; cart total equals sum of line totals; change quantity; remove product |
| Checkout | logged-in user pays by credit card |
| API | product list and details; unknown product; categories; login with valid and invalid credentials |

## Project structure

```
pages/        Page Objects (HomePage, CatalogPage, ProductPage, CartPage, LoginPage, RegisterPage, CheckoutPage)
fixtures/     Shared fixtures: a freshly registered user per worker and a logged-in page
tests/        UI and API specs
.github/      CI workflow
```

## Approach

- **Page Object pattern**: locators and actions live in `pages/`, tests read like scenarios.
- **Isolated test data**: a new user is registered through the UI for each run, so tests do not depend on the demo site's database.
- **Web-first assertions** and no hard-coded waits.
- **API tests** use Playwright's `request` and are independent of the browser.
- **CI**: every push runs the full suite on GitHub Actions; the HTML report is stored as a build artifact.

## Run locally

```bash
npm install
npx playwright install
npx playwright test            # all tests
npx playwright test --headed   # watch the browser
npx playwright show-report     # open the HTML report
```

## Notes

The target site is a public demo shared by many users, so occasional slowness or data resets are possible.