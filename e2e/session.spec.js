import {test, expect} from '@playwright/test'

test('allauth provides dashboard account data across login, reload and logout', async ({page}) => {
  const legacyRequests = []
  const pageErrors = []
  page.on('pageerror', error => pageErrors.push(error.message))
  page.on('request', request => {
    if (/^\/api\/v1\/session(?:\/|$)/.test(new URL(request.url()).pathname)) legacyRequests.push(request.url())
  })
  await page.route('https://matomo.internet.nl/**', route => route.abort())
  await page.goto('/domains')
  await expect(page).toHaveURL(/\/account\/login$/)
  await page.locator('#login-identifier').fill('browser-session')
  await page.locator('#login-password').fill('browser-test-password')
  const loginResponse = page.waitForResponse(response => new URL(response.url()).pathname.endsWith('/auth/login'))
  await page.locator('form').filter({has: page.locator('#login-password')}).getByRole('button', {name: 'Login', exact: true}).click()
  const user = (await (await loginResponse).json()).data.user
  expect(user.account_name).toBe('Browser session')
  expect(user.account_id).not.toBe(user.id)
  expect(user.is_superuser).toBe(true)
  await expect(page).toHaveURL(/\/domains$/)
  await expect(page.getByRole('button', {name: /Browser uploads/})).toBeVisible()

  await page.reload()
  await expect(page).toHaveURL(/\/domains$/)
  await page.getByRole('button', {name: 'Account', exact: true}).click()
  await expect(page.getByText('Logged in as: Browser session', {exact: true})).toBeVisible()

  await page.goto('/account/logout')
  const logoutResponse = page.waitForResponse(response => response.request().method() === 'DELETE'
    && new URL(response.url()).pathname.endsWith('/auth/session'))
  await page.getByRole('button', {name: 'Logout', exact: true}).click()
  expect((await logoutResponse).status()).toBe(401)
  await expect(page).toHaveURL(/\/home$/)
  await expect(page.getByRole('link', {name: 'Log in', exact: true})).toBeVisible()
  await page.goto('/domains')
  await expect(page).toHaveURL(/\/account\/login$/)
  expect(legacyRequests).toEqual([])
  expect(pageErrors).toEqual([])
})
