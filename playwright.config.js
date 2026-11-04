import {defineConfig} from '@playwright/test'
import {resolve, join} from 'node:path'

const backend = resolve(process.env.DASHBOARD_BACKEND_PATH || '../Internet.nl-dashboard')
const python = process.env.DASHBOARD_BACKEND_PYTHON || join(backend, '.venv', 'bin', 'python')
const quote = value => "'" + value.replaceAll("'", "'\\''") + "'"

export default defineConfig({
  testDir: './e2e',
  timeout: 90_000,
  expect: {timeout: 30_000},
  fullyParallel: false,
  workers: 1,
  maxFailures: 1,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    launchOptions: process.env.PLAYWRIGHT_EXECUTABLE_PATH
      ? {executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH} : {},
  },
  webServer: [
    {
      command: `${quote(python)} e2e/backend.py`,
      env: {DASHBOARD_BACKEND_PATH: backend},
      url: 'http://127.0.0.1:18765/api/v1/allauth/browser/v1/config',
      timeout: 120_000,
      reuseExistingServer: false,
    },
    {
      command: `${quote(process.execPath)} node_modules/vite/bin/vite.js --config e2e/vite.config.js`,
      env: {VITE_VUE_APP_DJANGO_PATH: ''},
      url: 'http://127.0.0.1:4173',
      timeout: 60_000,
      reuseExistingServer: false,
    },
  ],
})
