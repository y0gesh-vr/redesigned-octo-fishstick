import { test, expect, Page } from '@playwright/test';

const BASE_URL = process.env.BASE_URL ?? 'https://ascent-support.apica.io/login';
const AUTH_ERROR_TEXT = process.env.AUTH_ERROR_TEXT ?? 'Invalid username or password';
const VALIDATION_EMAIL_ERROR = process.env.VALIDATION_EMAIL_ERROR ?? 'Please enter a valid email';
const FORGOT_PASSWORD_SUCCESS_TEXT =
  process.env.FORGOT_PASSWORD_SUCCESS_TEXT ??
  'If an account is associated with this email, a verification code has been sent to it.';

const selectors = {
  username: /email id/i,
  password: /password/i,
  submit: /^login$/i,
  forgotPasswordLink: /forgot password/i,
  forgotPasswordSubmit: /send email/i,
};

function usernameInput(page: Page) {
  return page.getByRole('textbox', { name: selectors.username }).first();
}

function passwordInput(page: Page) {
  return page.getByRole('textbox', { name: selectors.password }).first();
}

function loginButton(page: Page) {
  return page.getByRole('button', { name: selectors.submit }).first();
}

function forgotPasswordLink(page: Page) {
  return page.getByRole('link', { name: selectors.forgotPasswordLink }).first();
}

function forgotPasswordEmailInput(page: Page) {
  return page.getByRole('textbox', { name: selectors.username }).first();
}

function forgotPasswordSubmitButton(page: Page) {
  return page.getByRole('button', { name: selectors.forgotPasswordSubmit }).first();
}

async function gotoLogin(page: Page) {
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
  await expect(usernameInput(page)).toBeVisible();
  await expect(passwordInput(page)).toBeVisible();
}

async function fillLogin(page: Page, username: string, password: string) {
  const usernameField = usernameInput(page);
  const passwordField = passwordInput(page);

  await usernameField.fill('');
  await passwordField.fill('');

  if (username) {
    await usernameField.fill(username);
  }

  if (password) {
    await passwordField.fill(password);
  }
}

async function assertStillOnLogin(page: Page) {
  await expect(usernameInput(page)).toBeVisible();
  await expect(passwordInput(page)).toBeVisible();
  await expect(page).toHaveURL(/login|signin|auth/i);
}

async function openForgotPassword(page: Page) {
  const forgotLink = forgotPasswordLink(page);
  await expect(forgotLink).toBeVisible();
  await forgotLink.click();
  await expect(page).toHaveURL(/forgot|reset/i);
  await expect(forgotPasswordEmailInput(page)).toBeVisible();
}

test.describe('Login page only coverage', () => {
  test(`username payload is rejected client-side: <script>alert(1)</script>`, async ({ page }) => {
    let dialogSeen = false;

    page.on('dialog', async dialog => {
      dialogSeen = true;
      await dialog.dismiss();
    });

    await gotoLogin(page);
    await fillLogin(page, '<script>alert(1)</script>', 'wrongpass123');
    await loginButton(page).click();

    await expect(page.getByText(VALIDATION_EMAIL_ERROR, { exact: true })).toBeVisible();
    await expect(usernameInput(page)).toHaveAttribute('aria-invalid', 'true');
    await expect(dialogSeen).toBeFalsy();
    await assertStillOnLogin(page);
  });
});
