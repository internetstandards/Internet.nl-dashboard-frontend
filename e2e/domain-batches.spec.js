import {test, expect} from '@playwright/test'
import {readFileSync} from 'node:fs'
import {resolve} from 'node:path'

const spreadsheet = resolve('public/static_frontend/sample_spreadsheets/microsoft_office_spreadsheet_with_example_data.xlsx')
const fileLabel = 'Choose or drop a spreadsheet here'
const dropZoneName = /^Drop a spreadsheet here/

async function openList(page) {
  await page.goto('/domains')
  await page.getByRole('button', {name: /Browser uploads/}).click()
  await expect(page.locator('.domain-table').getByText('existing.nl', {exact: true})).toBeVisible()
  await expect(page.getByRole('heading', {name: 'Pending domain imports'})).toHaveCount(0)
}

async function dropSpreadsheet(page, scope = page, path = spreadsheet) {
  const transfer = await page.evaluateHandle(({bytes, name}) => {
    const file = new File([Uint8Array.from(atob(bytes), character => character.charCodeAt(0))], name,
      {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})
    const data = new DataTransfer()
    data.items.add(file)
    return data
  }, {bytes: readFileSync(path).toString('base64'), name: 'example.xlsx'})
  const zone = scope.getByRole('button', {name: dropZoneName})
  await expect(zone).toBeVisible()
  await zone.dispatchEvent('dragenter', {dataTransfer: transfer})
  await expect(zone).toHaveClass(/is-dragging/)
  await zone.dispatchEvent('drop', {dataTransfer: transfer})
  await expect(zone).not.toHaveClass(/is-dragging/)
  await transfer.dispose()
}

async function checkFile(scope, endpoint, selectFile) {
  const page = scope.page ? scope.page() : scope
  const responsePromise = page.waitForResponse(response => response.request().method() === 'POST'
    && new URL(response.url()).pathname === endpoint)
  if (selectFile) await selectFile()
  else await scope.getByRole('button', {name: 'Check domains', exact: true}).click()
  const response = await responsePromise
  expect(response.status(), await response.text()).toBe(202)
  expect(response.request().headers()['content-type']).toMatch(/^multipart\/form-data; boundary=/)
  expect(response.request().postDataBuffer().includes(Buffer.from('name="file"; filename='))).toBe(true)
  const batch = await response.json()
  const progress = page.getByRole('region', {name: 'Domain processing progress'}).filter({hasText: batch.filename})
  await expect(progress.getByRole('button', {name: 'Resolve and add valid domains', exact: true})).toBeVisible()
  await expect(progress.getByRole('progressbar')).toHaveCount(0)
  expect(batch.id).toBeGreaterThan(0)
  return {batch, progress}
}

test.beforeEach(async ({page}, info) => {
  // Authenticate through the real login UI; delayed requests below retain real API responses.
  await page.route('https://matomo.internet.nl/**', route => route.abort())
  await page.goto('/account/login')
  await page.locator('#login-identifier').fill(`browser-${info.title.split(' ')[0]}`)
  await page.locator('#login-password').fill('browser-test-password')
  await page.locator('form').filter({has: page.locator('#login-password')}).getByRole('button', {name: 'Login', exact: true}).click()
  await expect(page).toHaveURL(/\/domains$/)
})

test('picker instantly uploads through the keyboard-accessible drop zone and waits for confirmation', async ({page}, info) => {
  await page.goto('/domains/upload')
  const zone = page.getByRole('button', {name: dropZoneName})
  await expect(zone).toBeVisible()
  await expect(page.getByRole('button', {name: 'Check domains', exact: true})).toHaveCount(0)
  await zone.screenshot({path: info.outputPath('drop-zone.png')})
  const chooserPromise = page.waitForEvent('filechooser')
  await zone.focus()
  await page.keyboard.press('Enter')
  const chooser = await chooserPromise
  const {batch, progress} = await checkFile(page, '/api/v1/urllists/import-spreadsheets', () => chooser.setFiles(spreadsheet))
  const preview = await (await page.request.get(`/api/v1/urllists/domain-batches/${batch.id}`)).json()
  expect(preview.counts.valid).toBeGreaterThan(0)
  await expect(progress.getByText(/domains have been added/)).toHaveCount(0)
  await progress.getByRole('button', {name: 'Resolve and add valid domains'}).click()
  await expect(progress.getByText(/\d+ domains have been added\./)).toBeVisible()
  const completed = await (await page.request.get(`/api/v1/urllists/domain-batches/${batch.id}`)).json()
  expect(completed.status).toBe('completed')
  expect(completed.counts.added).toBeGreaterThan(0)
  expect(completed.lists.length).toBeGreaterThan(0)
  await expect(progress.getByRole('link', {name: `Open list: ${completed.lists[0].name} →`, exact: true})).toBeVisible()
  await progress.screenshot({path: info.outputPath('completed-import.png')})
})

test('drop instantly uploads the example XLSX without a submit click and recovers history after reload', async ({page}, info) => {
  await page.goto('/domains/upload')
  await expect(page.getByRole('button', {name: 'Check domains', exact: true})).toHaveCount(0)
  const {batch} = await checkFile(page, '/api/v1/urllists/import-spreadsheets', () => dropSpreadsheet(page))
  await page.reload()
  await page.locator('summary').filter({hasText: 'example.xlsx'}).click()
  const progress = page.getByRole('region', {name: 'Domain processing progress'})
  await expect(progress.getByRole('button', {name: 'Resolve and add valid domains', exact: true})).toBeVisible()
  await expect(progress.getByRole('progressbar')).toHaveCount(0)
  await expect(progress.getByRole('heading')).toHaveCount(0)
  await expect(progress).toHaveCSS('border-top-width', '0px')
  await expect(progress).toHaveCSS('border-radius', '0px')
  await page.screenshot({path: info.outputPath('history-review.png'), fullPage: true})
  await progress.getByRole('button', {name: 'Resolve and add valid domains'}).click()
  await expect(progress.getByText(/\d+ domains have been added\./)).toBeVisible()
  expect((await (await page.request.get(`/api/v1/urllists/domain-batches/${batch.id}`)).json()).status).toBe('completed')
  await expect(progress.getByRole('progressbar')).toHaveCount(0)
  await expect(page.locator('summary').filter({hasText: 'example.xlsx'})).toContainText('Completed')
  await page.screenshot({path: info.outputPath('history-completed.png'), fullPage: true})
})

test('list uploads a dropped spreadsheet through the list modal and retains existing domains', async ({page}) => {
  await openList(page)
  const list = (await (await page.request.get('/api/v1/urllists')).json()).lists.find(list => list.name === 'Browser uploads')
  await page.getByRole('button', {name: '⬆️ Spreadsheet', exact: true}).click()
  const dialog = page.getByRole('dialog')
  const {progress} = await checkFile(dialog, `/api/v1/urllists/${list.id}/spreadsheets`, () => dropSpreadsheet(page, dialog))
  await progress.getByRole('button', {name: 'Resolve and add valid domains'}).click()
  await expect(progress.getByText('2 domains have been added.', {exact: true})).toBeVisible()
  const content = await (await page.request.get(`/api/v1/urllists/${list.id}/urls`)).json()
  expect(content.urls.map(item => item.url)).toContain('existing.nl')
  expect(content.urls).toHaveLength(3)
})

test('corrections edits rejected rows and checks duplicate-aware capacity before adding in input order', async ({page}, info) => {
  await openList(page)
  const list = (await (await page.request.get('/api/v1/urllists')).json()).lists.find(list => list.name === 'Browser uploads')
  await page.getByRole('button', {name: '⬆️ Spreadsheet', exact: true}).click()
  const dialog = page.getByRole('dialog')
  const {progress} = await checkFile(dialog, `/api/v1/urllists/${list.id}/spreadsheets`, () =>
    dialog.getByLabel(fileLabel).setInputFiles({name: 'corrections.csv', mimeType: 'text/csv',
      buffer: Buffer.from('Domain,Tags\nexisting.nl,keep\nz.nl,first\nbroken,corrected\na.nl,later\nb.nl,later\ndiscard-me,discard\n')}))
  await expect(progress.getByText('1 domains already in the list', {exact: true})).toBeVisible()
  await expect(progress.getByText(/3 new domains could exceed the available 2 places/)).toBeVisible()
  await expect(progress.getByRole('button', {name: 'Previous', exact: true})).toHaveCount(0)
  await expect(progress.getByRole('button', {name: 'Next', exact: true})).toHaveCount(0)
  await expect(progress).not.toContainText('Review the results and correct rejected rows before confirming.')
  await expect(progress).not.toContainText('Changes retain the original list, tags and input order.')
  const sequence = await progress.evaluate(element => {
    const selectors = ['.batch-counts', 'table', '.batch-actions']
    return selectors.map(selector => Array.from(element.querySelectorAll('*')).indexOf(element.querySelector(selector)))
  })
  expect(sequence.every((position, index) => position >= 0 && (index === 0 || position > sequence[index - 1]))).toBe(true)
  await expect(progress.getByRole('columnheader')).toHaveText(['Row', 'List', 'Domain', 'Reason'])
  const rejectedRow = progress.locator('tbody tr').first()
  await expect(rejectedRow.locator('td').nth(0)).toHaveText('4')
  await expect(rejectedRow.locator('td').nth(1)).toHaveText('Browser uploads')
  await expect(progress.locator('.batch-counts > li')).toHaveCount(3)
  await expect(progress.getByText('0 duplicate entries skipped', {exact: true})).toHaveCount(0)
  await progress.screenshot({path: info.outputPath('rejected-input-review.png')})
  const filter = progress.getByRole('searchbox', {name: 'Filter rejected domains', exact: true})
  await filter.fill('discard-me')
  await expect(progress.getByText('1 of 2 rejected domains match your filter.', {exact: true})).toBeVisible()
  await expect(progress.locator('[data-domain]')).toHaveCount(1)
  const clear = progress.getByRole('button', {name: 'Clear domain on row 7', exact: true})
  await expect(clear.locator('svg')).toBeVisible()
  await clear.click()
  await expect(progress.getByLabel('Correct domain on row 7', {exact: true})).toHaveValue('')
  await expect(clear).toBeDisabled()
  await expect(filter).toBeEnabled()
  await expect(progress.getByRole('button', {name: 'Clear filter', exact: true})).toBeEnabled()
  const cancel = progress.getByRole('button', {name: 'Cancel import', exact: true})
  await expect(cancel).toHaveClass(/btn-danger/)
  expect(await cancel.evaluate(element => element.nextElementSibling.textContent.trim())).toBe('Resolve and add valid domains')
  await progress.locator('.batch-actions').screenshot({path: info.outputPath('import-actions.png')})
  await filter.fill('broken')
  await expect(progress.getByLabel('Correct domain on row 4', {exact: true})).toBeVisible()
  await progress.getByLabel('Correct domain on row 4', {exact: true}).fill('second.nl')
  await expect(progress.getByRole('button', {name: 'Resolve and add valid domains'})).toBeDisabled()
  await progress.getByRole('button', {name: 'Check corrections', exact: true}).click()
  await expect(progress.getByRole('button', {name: 'Resolve and add valid domains'})).toBeEnabled()
  await expect(progress.getByText('0 rejected domains', {exact: true})).toHaveCount(0)
  await progress.getByRole('button', {name: 'Resolve and add valid domains'}).click()
  await expect(progress.getByText('2 domains have been added.', {exact: true})).toBeVisible()
  const content = await (await page.request.get(`/api/v1/urllists/${list.id}/urls`)).json()
  expect(content.urls.map(item => item.url)).toEqual(expect.arrayContaining(['existing.nl', 'z.nl', 'second.nl']))
  expect(content.urls).toHaveLength(3)
  expect(content.urls.find(item => item.url === 'second.nl').tags).toContain('corrected')
  await expect(progress.getByText('2 rejected domains', {exact: true})).toBeVisible()
})

test('text submits over 500 domains as JSON and processes the ordered batch', async ({page}) => {
  await openList(page)
  const list = (await (await page.request.get('/api/v1/urllists')).json()).lists.find(list => list.name === 'Browser uploads')
  await page.getByRole('button', {name: /Free text/}).click()
  const dialog = page.getByRole('dialog')
  const input = Array.from({length: 501}, (_, index) => `d${index}.example.nl`).join('\n')
  await dialog.locator('textarea').fill(input)
  const responsePromise = page.waitForResponse(response => response.request().method() === 'POST'
    && new URL(response.url()).pathname === `/api/v1/urllists/${list.id}/urls`)
  await dialog.getByRole('button', {name: 'Check domains', exact: true}).click()
  const response = await responsePromise
  expect(response.status(), await response.text()).toBe(202)
  expect(response.request().headers()['content-type']).toContain('application/json')
  expect(response.request().postDataJSON()).toEqual({raw_urls: input})
  const progress = dialog.getByRole('region', {name: 'Domain processing progress'})
  await expect(progress.getByText('501 new valid domains', {exact: true})).toBeVisible()
  await progress.getByRole('button', {name: 'Resolve and add valid domains'}).click()
  await expect(progress.getByText('2 domains have been added.', {exact: true})).toBeVisible()
  const content = await (await page.request.get(`/api/v1/urllists/${list.id}/urls`)).json()
  expect(content.urls.map(item => item.url)).toEqual(expect.arrayContaining(['existing.nl', 'd0.example.nl', 'd1.example.nl']))
  expect(content.urls).toHaveLength(3)
  const filter = progress.getByRole('searchbox', {name: 'Filter rejected domains', exact: true})
  await expect(progress.locator('[data-domain]')).toHaveCount(50)
  const feedbackRequests = []
  page.on('request', request => {
    if (new URL(request.url()).pathname.endsWith('/rejections')) feedbackRequests.push(request.url())
  })
  await filter.fill('d500.example.nl')
  await expect(progress.getByText('1 of 499 rejected domains match your filter.', {exact: true})).toBeVisible()
  await expect(progress.locator('[data-domain]')).toHaveCount(1)
  await expect(progress.getByLabel('Correct domain on row 501', {exact: true})).toHaveValue('d500.example.nl')
  await expect(progress.getByRole('button', {name: 'Next', exact: true})).toHaveCount(0)
  await filter.fill('no matching rejection')
  await expect(progress.getByText('0 of 499 rejected domains match your filter.', {exact: true})).toBeVisible()
  await expect(progress.locator('table')).toHaveCount(0)
  await progress.getByRole('button', {name: 'Clear filter', exact: true}).click()
  await expect(filter).toHaveValue('')
  await expect(progress.locator('[data-domain]')).toHaveCount(50)
  await expect(progress.getByRole('button', {name: 'Next', exact: true})).toBeEnabled()
  await progress.getByRole('button', {name: 'Next', exact: true}).click()
  await expect(progress.locator('.batch-pagination')).toContainText('51–100 / 499')
  await expect(progress.getByLabel('Correct domain on row 53', {exact: true})).toHaveValue('d52.example.nl')
  expect(feedbackRequests).toEqual([])
})

test('failure shows an unreadable file error and accepts a replacement without reloading', async ({page}) => {
  await page.goto('/domains/upload')
  const responsePromise = page.waitForResponse(response => response.request().method() === 'POST'
    && new URL(response.url()).pathname === '/api/v1/urllists/import-spreadsheets')
  await page.getByLabel(fileLabel).setInputFiles({name: 'unreadable.xlsx', mimeType: 'application/octet-stream',
    buffer: Buffer.from('this is not a spreadsheet')})
  expect((await responsePromise).status()).toBe(202)
  await expect(page.getByRole('alert').filter({hasText: 'The spreadsheet could not be read'})).toBeVisible()
  const {progress} = await checkFile(page, '/api/v1/urllists/import-spreadsheets',
    () => page.getByLabel(fileLabel).setInputFiles(spreadsheet))
  await expect(progress.getByRole('button', {name: 'Resolve and add valid domains'})).toBeEnabled()
})

test('cancel stops a reviewed import without redundant links to the current list', async ({page}) => {
  await openList(page)
  const list = (await (await page.request.get('/api/v1/urllists')).json()).lists.find(list => list.name === 'Browser uploads')
  await page.getByRole('button', {name: '⬆️ Spreadsheet', exact: true}).click()
  const dialog = page.getByRole('dialog')
  const {batch, progress} = await checkFile(dialog, `/api/v1/urllists/${list.id}/spreadsheets`, () => dropSpreadsheet(page, dialog))
  const cancelled = page.waitForResponse(response => response.request().method() === 'DELETE'
    && new URL(response.url()).pathname === `/api/v1/urllists/domain-batches/${batch.id}`)
  await progress.getByRole('button', {name: 'Cancel import', exact: true}).click()
  expect((await cancelled).status()).toBe(204)
  await expect(progress.getByText('Import cancelled. 0 domains were added before cancellation.', {exact: true})).toBeVisible()
  await expect(progress.getByRole('button', {name: 'Resolve and add valid domains'})).toHaveCount(0)
  const content = await (await page.request.get(`/api/v1/urllists/${list.id}/urls`)).json()
  expect(content.urls.map(item => item.url)).toEqual(['existing.nl'])
  await expect(progress.getByRole('link', {name: 'Open list: Browser uploads →', exact: true})).toHaveCount(0)
  await dialog.getByRole('button', {name: 'Close', exact: true}).click()
  await expect(page.locator('summary').filter({hasText: 'example.xlsx'})).toHaveCount(0)
  await expect(page.getByRole('heading', {name: 'Pending domain imports'})).toHaveCount(0)
  await page.goto('/domains/upload')
  await expect(page.getByRole('heading', {name: 'Recent domain imports'})).toBeVisible()
  await page.locator('summary').filter({hasText: 'example.xlsx'}).click()
  const historyProgress = page.getByRole('region', {name: 'Domain processing progress'})
  await expect(historyProgress.getByText('Import cancelled. 0 domains were added before cancellation.', {exact: true})).toBeVisible()
  await expect(historyProgress.getByRole('link', {name: 'Open list: Browser uploads →', exact: true})).toBeVisible()
})

test('stalled cancels a crashed worker from history and uses a striped waiting bar', async ({page}, info) => {
  await page.goto('/domains/upload')
  await page.locator('summary').filter({hasText: 'stalled.csv'}).click()
  const progress = page.getByRole('region', {name: 'Domain processing progress'})
  const fill = progress.locator('.batch-progress-fill')
  await expect(progress.getByRole('progressbar')).not.toHaveAttribute('aria-valuenow')
  expect(await fill.evaluate(element => getComputedStyle(element).animationName)).toBe('progress-bar-stripes')
  expect(await fill.evaluate(element => getComputedStyle(element).transform)).toBe('none')
  await progress.screenshot({path: info.outputPath('waiting-progress.png')})
  await page.screenshot({path: info.outputPath('import-history.png'), fullPage: true})
  await page.emulateMedia({reducedMotion: 'reduce'})
  expect(await fill.evaluate(element => getComputedStyle(element).animationName)).toBe('none')
  await progress.getByRole('button', {name: 'Cancel import', exact: true}).click()
  await expect(progress.getByText('Import cancelled. 0 domains were added before cancellation.', {exact: true})).toBeVisible()
  await expect(page.locator('summary').filter({hasText: 'stalled.csv'})).toContainText('Cancelled')
  await expect(progress.getByRole('button', {name: 'Resume processing'})).toHaveCount(0)
})

test('overwrite requires switching on and typing the word, replaces all contents, and opens the result list', async ({page}, info) => {
  await openList(page)
  const list = (await (await page.request.get('/api/v1/urllists')).json()).lists.find(list => list.name === 'Browser uploads')
  await page.getByRole('button', {name: '⬆️ Spreadsheet', exact: true}).click()
  const dialog = page.getByRole('dialog')
  const {progress} = await checkFile(dialog, `/api/v1/urllists/${list.id}/spreadsheets`, () =>
    dialog.getByLabel(fileLabel).setInputFiles({name: 'replacement.csv', mimeType: 'text/csv',
      buffer: Buffer.from('Domain,Tags\nexisting.nl,incoming\nz.nl,one\na.nl,two\n')}))
  await expect(progress.getByText(/2 new domains could exceed the available 1 places/)).toBeVisible()
  const toggle = progress.getByRole('switch', {name: 'Overwrite current list', exact: true})
  await toggle.check()
  await expect(progress.getByRole('button', {name: 'Resolve and add valid domains'})).toBeDisabled()
  const word = progress.getByLabel('Type “overwrite” to enable overwriting:', {exact: true})
  await word.fill('wrong')
  await expect(progress.getByRole('button', {name: 'Resolve and add valid domains'})).toBeDisabled()
  await word.fill('overwrite')
  await expect(progress.getByRole('button', {name: 'Confirm overwrite and process'})).toBeEnabled()
  await toggle.uncheck()
  await expect(word).toHaveCount(0)
  await expect(progress.getByRole('button', {name: 'Resolve and add valid domains'})).toBeEnabled()
  await toggle.check()
  await expect(word).toHaveValue('')
  await word.fill('overwrite')
  await progress.screenshot({path: info.outputPath('overwrite-confirmation.png')})
  await page.evaluate(() => {
    window.importLoadingFlashes = 0
    window.importLoadingObserver = new MutationObserver(records => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (node instanceof Element && (node.matches('.fullwidth.loading') || node.querySelector('.fullwidth.loading')))
            window.importLoadingFlashes += 1
        }
      }
    })
    window.importLoadingObserver.observe(document.body, {childList: true, subtree: true})
  })
  await progress.getByRole('button', {name: 'Confirm overwrite and process'}).click()
  await expect(progress.getByText('List replaced with 3 domains.', {exact: true})).toBeVisible()
  const content = await (await page.request.get(`/api/v1/urllists/${list.id}/urls`)).json()
  expect(content.urls.map(item => item.url)).toEqual(expect.arrayContaining(['existing.nl', 'z.nl', 'a.nl']))
  expect(content.urls).toHaveLength(3)
  expect(content.urls.find(item => item.url === 'existing.nl').tags).toEqual(['incoming'])
  await expect(page.locator('.domain-table').getByText('remove.nl', {exact: true})).toHaveCount(0)
  expect(await page.evaluate(() => window.importLoadingFlashes)).toBe(0)
  await page.evaluate(() => window.importLoadingObserver.disconnect())
  await progress.screenshot({path: info.outputPath('replacement-completed.png')})
  await expect(page.locator('summary').filter({hasText: 'replacement.csv'})).toHaveCount(0)
  await expect(page.getByRole('heading', {name: 'Pending domain imports'})).toHaveCount(0)
  await expect(progress.getByRole('link', {name: 'Open list: Browser uploads →', exact: true})).toHaveCount(0)
  await page.goto('/domains/upload')
  await page.locator('summary').filter({hasText: 'replacement.csv'}).click()
  const uploadHistory = page.getByRole('region', {name: 'Domain processing progress'})
  await uploadHistory.getByRole('link', {name: 'Open list: Browser uploads →', exact: true}).click()
  await expect(page).toHaveURL(new RegExp(`/domains\\?open=${list.id}#${list.id}$`))
  await expect(page.getByRole('button', {name: /Browser uploads/})).toHaveAttribute('aria-expanded', 'true')
  await expect(page.locator('.domain-table').getByText('existing.nl', {exact: true})).toBeVisible()
  await expect(page.locator('summary').filter({hasText: 'replacement.csv'})).toHaveCount(0)
  await expect(page.getByRole('heading', {name: 'Pending domain imports'})).toHaveCount(0)
  await page.getByRole('button', {name: /Free text/}).click()
  const pendingDialog = page.getByRole('dialog')
  await pendingDialog.locator('textarea').fill('pending.nl')
  const nextResponse = page.waitForResponse(response => response.request().method() === 'POST'
    && new URL(response.url()).pathname === `/api/v1/urllists/${list.id}/urls`)
  await pendingDialog.getByRole('button', {name: 'Check domains', exact: true}).click()
  const next = await nextResponse
  expect(next.status(), await next.text()).toBe(202)
  const pendingBatch = await next.json()
  await expect(pendingDialog.getByRole('button', {name: 'Resolve and add valid domains'})).toBeEnabled()
  await pendingDialog.getByRole('button', {name: 'Close', exact: true}).click()
  await page.getByRole('button', {name: 'Refresh imports', exact: true}).click()
  await expect(page.locator('summary').filter({hasText: 'Domain import'})).toHaveCount(1)
  let domainReloads = 0
  page.on('request', request => {
    if (new URL(request.url()).pathname === `/api/v1/urllists/${list.id}/urls`) domainReloads += 1
  })
  let releaseDetail
  const waitForRelease = new Promise(resolve => {releaseDetail = resolve})
  const detailPath = `/api/v1/urllists/domain-batches/${pendingBatch.id}`
  await page.route(`**${detailPath}`, async route => {
    const response = await route.fetch()
    await waitForRelease
    await route.fulfill({response})
  })
  const detailRequested = page.waitForRequest(request => new URL(request.url()).pathname === detailPath)
  await page.locator('summary').filter({hasText: 'Domain import'}).click()
  await detailRequested
  const localImport = page.getByRole('region', {name: 'Domain processing progress'})
  try {
    await expect(localImport.locator('.batch-loading')).toBeVisible()
    await expect(page.locator('.fullwidth.loading')).toHaveCount(0)
    await expect(page.locator('.domain-table').getByText('existing.nl', {exact: true})).toBeVisible()
    await page.locator('details[open]').screenshot({path: info.outputPath('import-local-loading.png')})
  } finally {
    releaseDetail()
  }
  await expect(localImport.locator('.batch-loading')).toHaveCount(0)
  await expect(localImport.getByRole('button', {name: 'Resolve and add valid domains'})).toBeEnabled()
  expect(domainReloads).toBe(0)
  await page.unroute(`**${detailPath}`)
})
