// SPDX-License-Identifier: Apache-2.0
// Keep the HTTP response intact; network failures have no HTTP status.
export function requestError(error) {
  return error.response || {status: 0, data: {detail: 'Unable to contact the server.'}};
}
