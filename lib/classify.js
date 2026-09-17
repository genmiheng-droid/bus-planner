/**
 * Classifies a provider HTTP response / fetch result into canonical application states:
 * 'ok' (200) | 'empty' (200) | 'refused' (502) | 'busy' (503) | 'unreachable' (504)
 *
 * @param {Object} input
 * @param {number} input.status - HTTP status code received from provider
 * @param {string} [input.contentType] - Content-Type header string
 * @param {string} [input.bodyText] - Raw response body string (never call .json() directly)
 * @param {Function} [input.pick] - Selector function to extract data items (e.g. b => b.Services)
 * @param {boolean} [input.timedOut] - Whether request timed out
 * @param {Error} [input.error] - Network or fetch error
 * @returns {{ state: string, status: number, data?: any, raw?: any, message?: string, error?: string }}
 */
export function classify({ status, contentType = '', bodyText = '', pick, timedOut = false, error = null }) {
  if (timedOut || (error && (error.name === 'AbortError' || error.code === 'ETIMEDOUT'))) {
    return {
      state: 'unreachable',
      status: 504,
      error: 'We could not reach LTA, so nothing on this panel has updated.',
    };
  }

  if (error || typeof status !== 'number' || status === 0) {
    return {
      state: 'unreachable',
      status: 504,
      error: 'We could not reach LTA, so nothing on this panel has updated.',
    };
  }

  // Busy states: 429 Too Many Requests or 503 Service Unavailable
  if (status === 429 || status === 503) {
    return {
      state: 'busy',
      status: 503,
      error: 'The bus service is busy. We will try again in 10 seconds.',
    };
  }

  // Refused states: 401 Unauthorized, 403 Forbidden, 404 Not Found, or other 4xx errors
  // LTA's 401 body is empty and its 404 body is plain text
  if (status === 401 || status === 403 || status === 404 || (status >= 400 && status < 500)) {
    return {
      state: 'refused',
      status: 502,
      error: 'We could not get bus times, so nothing on this panel is current. Please tell us if this stays.',
    };
  }

  // Provider server errors: 500, 502, 504
  if (status >= 500) {
    return {
      state: 'unreachable',
      status: 504,
      error: 'We could not reach LTA, so nothing on this panel has updated.',
    };
  }

  // Status is 2xx. Validate body text
  if (!bodyText || bodyText.trim() === '') {
    return {
      state: 'empty',
      status: 200,
      data: [],
      raw: null,
      message: 'LTA answered, but no buses are listed for this stop right now.',
    };
  }

  try {
    const parsed = JSON.parse(bodyText);
    const selected = typeof pick === 'function' ? pick(parsed) : parsed;

    if (!selected || (Array.isArray(selected) && selected.length === 0)) {
      return {
        state: 'empty',
        status: 200,
        data: [],
        raw: parsed,
        message: 'LTA answered, but no buses are listed for this stop right now.',
      };
    }

    return {
      state: 'ok',
      status: 200,
      data: selected,
      raw: parsed,
    };
  } catch (parseError) {
    // If provider returned 200 but content was not valid JSON, treat as refused
    return {
      state: 'refused',
      status: 502,
      error: 'We could not get bus times, so nothing on this panel is current. Please tell us if this stays.',
    };
  }
}
