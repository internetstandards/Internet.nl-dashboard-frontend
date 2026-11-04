import {describe, expect, it, vi} from 'vitest'
import http from '@/httpclient'

function captureRequest() {
  return vi.fn(async config => ({data: {}, status: 202, statusText: 'Accepted', headers: {}, config}))
}

describe('real Axios request serialization', () => {
  it('preserves the spreadsheet File and FormData for the browser multipart adapter', async () => {
    const file = new File([new Uint8Array([80, 75, 3, 4])], 'example.xlsx',
      {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})
    const data = new FormData()
    data.append('file', file)
    const adapter = captureRequest()
    await http.post('/api/v1/urllists/import-spreadsheets', data, {adapter})
    const request = adapter.mock.calls[0][0]
    expect(request.data, 'Axios must leave multipart data intact rather than stringify File into JSON.').toBe(data)
    expect(request.data.get('file')).toBe(file)
    expect(request.headers.getContentType()).not.toContain('application/json')
    expect(request.withCredentials).toBe(true)
    expect(request.xsrfHeaderName).toBe('X-CSRFToken')
  })

  it('still serializes text-domain additions as JSON without a global Content-Type', async () => {
    const data = {raw_urls: 'example.nl\nsecond.nl'}
    const adapter = captureRequest()
    await http.post('/api/v1/urllists/1/urls', data, {adapter})
    const request = adapter.mock.calls[0][0]
    expect(request.headers.getContentType()).toBe('application/json')
    expect(JSON.parse(request.data)).toEqual(data)
  })
})
