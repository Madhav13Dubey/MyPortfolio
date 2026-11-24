import { expect, test } from '@playwright/test';

test('renders every section without console errors', async ({ page }) => {
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(e.message));

  await page.goto('/');
  await expect(page).toHaveTitle(/Madhav Dubey/);
  for (const id of ['home', 'about', 'skills', 'stack', 'projects', 'profiles', 'contact']) {
    await expect(page.locator(`#${id}`)).toBeAttached();
  }
  expect(errors.filter((e) => !/fonts\.(googleapis|gstatic)|ERR_/.test(e))).toEqual([]);
});

test('experience tab shows the Truvis roles', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('tab', { name: 'Experience' }).click();
  await expect(page.getByText('Software Development Engineer I', { exact: true })).toBeVisible();
});

test('phone number is masked and no tel: link exists', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('6006XXXXXX')).toBeAttached();
  await expect(page.locator('a[href^="tel:"]')).toHaveCount(0);
});

test('every image loads', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() =>
    document.querySelectorAll('img[loading=lazy]').forEach((i) => (i.loading = 'eager')),
  );
  await page.waitForLoadState('load');
  const broken = await page.$$eval('img', (imgs) =>
    imgs.filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src),
  );
  expect(broken).toEqual([]);
});

test('theme toggle switches and persists', async ({ page }) => {
  await page.goto('/');
  const html = page.locator('html');
  const before = await html.getAttribute('data-theme');
  await page.evaluate(() => document.getElementById('themeBtn').click());
  await expect(html).not.toHaveAttribute('data-theme', before);
  await page.reload();
  await expect(html).not.toHaveAttribute('data-theme', before);
});
