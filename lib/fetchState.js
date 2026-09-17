import { classify } from './classify.js';

/**
 * Calls a provider endpoint with a 6-second timeout, reads status, content-type,
 * and body text (never calling .json() directly), then delegates to classify().
 *
 * @param {string} url - Target URL to fetch
 * @param {RequestInit} [options={}] - Standard fetch RequestInit options
 * @param {Object} [config={}] - Additional configuration
 * @param {number} [config.timeoutMs=6000] - Timeout in milliseconds (default 6000)
 * @param {Function} [config.pick] - Function to select items from JSON (e.g. b => b.Services)
 * @returns {Promise<{ state: string, status: number, data?: any, raw?: any, ms: number, reachable: boolean, upstreamStatus: number | null, error?: string, message?: string }>}
 */
export async function fetchState(url, options = {}, { timeoutMs = 6000, pick } = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  const startTime = Date.now();

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    const ms = Math.max(0, Date.now() - startTime);
    clearTimeout(timeoutId);

    const status = Number(response.status);
    const contentType = String(response.headers.get('content-type') || '');
    const bodyText = await response.text();

    const classification = classify({
      status,
      contentType,
      bodyText,
      pick,
    });

    return {
      ...classification,
      ms,
      reachable: status < 500,
      upstreamStatus: status,
    };
  } catch (err) {
    const ms = Math.max(0, Date.now() - startTime);
    clearTimeout(timeoutId);

    const isTimeout = err && (err.name === 'AbortError' || err.code === 'ETIMEDOUT');
    const classification = classify({
      status: 0,
      timedOut: isTimeout,
      error: err,
      pick,
    });

    return {
      ...classification,
      ms,
      reachable: false,
      upstreamStatus: null,
    };
  }
}
