import { fetchState } from '../lib/fetchState.js';

/**
 * Sends a JSON response with status code and headers.
 */
function sendJson(res, statusCode, body) {
  if (typeof res.status === 'function') {
    res.status(statusCode);
  } else {
    res.statusCode = statusCode;
  }
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
}

export default async function handler(req, res) {
  const key = process.env.LTA_ACCOUNT_KEY;
  const keyConfigured = Boolean(key && key.trim() !== '' && key !== 'undefined');

  // If key is not configured, report state 'my key not set' with status 503
  if (!keyConfigured) {
    let ltaProbe = {
      reachable: false,
      status: null,
      ms: 0,
    };

    try {
      const probeResult = await fetchState(
        'https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=03511',
        {},
        { timeoutMs: 6000 }
      );
      ltaProbe = {
        reachable: Boolean(probeResult.reachable),
        status: probeResult.upstreamStatus !== null ? Number(probeResult.upstreamStatus) : null,
        ms: Number(probeResult.ms) || 0,
      };
    } catch {
      ltaProbe = {
        reachable: false,
        status: null,
        ms: 0,
      };
    }

    res.setHeader('Cache-Control', 'no-store');
    return sendJson(res, 503, {
      state: 'my key not set',
      keyConfigured: false,
      lta: ltaProbe,
    });
  }

  // Key is configured: verify connection against LTA BusArrival endpoint
  try {
    const result = await fetchState(
      'https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=03511',
      {
        headers: {
          AccountKey: key,
        },
      },
      {
        timeoutMs: 6000,
        pick: (b) => b?.Services,
      }
    );

    const ltaInfo = {
      reachable: Boolean(result.reachable),
      status: result.upstreamStatus !== null ? Number(result.upstreamStatus) : null,
      ms: Number(result.ms) || 0,
    };

    const statusCode = result.status;
    if (result.state === 'ok' || result.state === 'empty') {
      res.setHeader('Cache-Control', 's-maxage=20, stale-while-revalidate=40');
    } else {
      res.setHeader('Cache-Control', 'no-store');
      if (result.state === 'busy') {
        res.setHeader('Retry-After', '10');
      }
    }

    return sendJson(res, statusCode, {
      state: result.state,
      keyConfigured: true,
      lta: ltaInfo,
    });
  } catch (err) {
    res.setHeader('Cache-Control', 'no-store');
    return sendJson(res, 504, {
      state: 'unreachable',
      keyConfigured: true,
      lta: {
        reachable: false,
        status: null,
        ms: 0,
      },
    });
  }
}
