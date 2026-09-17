import { fetchState } from '../lib/fetchState.js';

/**
 * Sends a JSON response with status code and headers, compatible with
 * Vercel Serverless Functions, Express, and Vite connect middleware.
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

/**
 * Converts an ISO 8601 arrival time string to minutes from now.
 * Casts strictly with Number() and guards against NaN/null/undefined.
 */
function calculateMinutes(isoString) {
  if (!isoString || typeof isoString !== 'string' || isoString.trim() === '') {
    return null;
  }
  const targetTime = new Date(isoString).getTime();
  if (Number.isNaN(targetTime)) {
    return null;
  }
  const diffMs = targetTime - Date.now();
  const diffMinutes = Math.floor(diffMs / 60000);
  const minutes = Math.max(0, diffMinutes);
  const resultNum = Number(minutes);
  return Number.isFinite(resultNum) ? resultNum : 0;
}

export default async function handler(req, res) {
  // Query extraction
  const query = req.query || {};
  const simulate = query.simulate ? String(query.simulate).toLowerCase() : null;

  // Allow usability testers to trigger specific mock states for inspection
  if (simulate) {
    if (simulate === 'busy') {
      res.setHeader('Cache-Control', 'no-store');
      res.setHeader('Retry-After', '10');
      return sendJson(res, 503, {
        state: 'busy',
        error: 'The bus service is busy. We will try again in 10 seconds.',
      });
    }
    if (simulate === 'refused') {
      res.setHeader('Cache-Control', 'no-store');
      return sendJson(res, 502, {
        state: 'refused',
        error: 'We could not get bus times, so nothing on this panel is current. Please tell us if this stays.',
      });
    }
    if (simulate === 'unreachable') {
      res.setHeader('Cache-Control', 'no-store');
      return sendJson(res, 504, {
        state: 'unreachable',
        error: 'We could not reach LTA, so nothing on this panel has updated.',
      });
    }
    if (simulate === 'empty') {
      res.setHeader('Cache-Control', 's-maxage=20, stale-while-revalidate=40');
      return sendJson(res, 200, {
        state: 'empty',
        busStopCode: String(query.BusStopCode || query.busStopCode || query.stop || '03511'),
        services: [],
        message: 'LTA answered, but no buses are listed for this stop right now.',
      });
    }
    if (simulate === 'key_not_set' || simulate === 'my_key_not_set') {
      res.setHeader('Cache-Control', 'no-store');
      return sendJson(res, 503, {
        state: 'my key not set',
        error: 'LTA_ACCOUNT_KEY is missing or blank in environment variables.',
      });
    }
  }

  // Guardrail: BEFORE the bus fetch: if LTA_ACCOUNT_KEY is missing or blank,
  // return 503 naming the variable and do not call LTA.
  const key = process.env.LTA_ACCOUNT_KEY;
  if (!key || key.trim() === '' || key === 'undefined') {
    res.setHeader('Cache-Control', 'no-store');
    return sendJson(res, 503, {
      state: 'my key not set',
      error: 'LTA_ACCOUNT_KEY environment variable is missing or blank.',
    });
  }

  const busStopCode = String(
    query.BusStopCode || query.busStopCode || query.stop || query.code || '03511'
  ).trim();

  const url = `https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=${encodeURIComponent(
    busStopCode
  )}`;

  try {
    const result = await fetchState(
      url,
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

    // Cache policy: s-maxage=20, stale-while-revalidate=40 on ok and empty replies only. Failures are no-store.
    if (result.state === 'ok' || result.state === 'empty') {
      res.setHeader('Cache-Control', 's-maxage=20, stale-while-revalidate=40');
    } else {
      res.setHeader('Cache-Control', 'no-store');
      if (result.state === 'busy') {
        res.setHeader('Retry-After', '10');
      }
    }

    if (result.state === 'empty') {
      return sendJson(res, 200, {
        state: 'empty',
        busStopCode,
        services: [],
        message: 'LTA answered, but no buses are listed for this stop right now.',
      });
    }

    if (result.state === 'refused') {
      return sendJson(res, 502, {
        state: 'refused',
        error: 'We could not get bus times, so nothing on this panel is current. Please tell us if this stays.',
      });
    }

    if (result.state === 'busy') {
      return sendJson(res, 503, {
        state: 'busy',
        error: 'The bus service is busy. We will try again in 10 seconds.',
      });
    }

    if (result.state === 'unreachable') {
      return sendJson(res, 504, {
        state: 'unreachable',
        error: 'We could not reach LTA, so nothing on this panel has updated.',
      });
    }

    // State is 'ok'
    const rawServices = Array.isArray(result.data) ? result.data : [];
    const services = rawServices.map((svc) => {
      const serviceNo = String(svc.ServiceNo || '');
      const minutesList = [];

      const m1 = calculateMinutes(svc.NextBus?.EstimatedArrival);
      if (m1 !== null) minutesList.push(m1);

      const m2 = calculateMinutes(svc.NextBus2?.EstimatedArrival);
      if (m2 !== null) minutesList.push(m2);

      const m3 = calculateMinutes(svc.NextBus3?.EstimatedArrival);
      if (m3 !== null) minutesList.push(m3);

      // Crowding mapping
      const loadCode = svc.NextBus?.Load || '';
      let crowding = 'Seats Available';
      if (loadCode === 'SDA') crowding = 'Standing Available';
      else if (loadCode === 'LSD') crowding = 'Limited Standing';

      // Deck Type mapping
      const typeCode = svc.NextBus?.Type || '';
      let deckType = 'Single Deck';
      if (typeCode === 'DD') deckType = 'Double Deck';
      else if (typeCode === 'BD') deckType = 'Bendy';

      const wheelchair = svc.NextBus?.Feature === 'WAB';
      const estMinutes = minutesList.length > 0 ? Number(minutesList[0]) : 0;
      const nextTimes = minutesList.slice(1).map((m) => `${m} mins`);

      return {
        service: serviceNo,
        operator: String(svc.Operator || ''),
        minutes: minutesList,
        estMinutes: Number.isFinite(estMinutes) ? estMinutes : 0,
        nextTimes,
        crowding,
        deckType,
        wheelchair,
        destination: String(svc.NextBus?.DestinationCode || busStopCode),
        status: 'On Time',
      };
    });

    return sendJson(res, 200, {
      state: 'ok',
      busStopCode,
      services,
    });
  } catch (err) {
    res.setHeader('Cache-Control', 'no-store');
    return sendJson(res, 504, {
      state: 'unreachable',
      error: 'We could not reach LTA, so nothing on this panel has updated.',
    });
  }
}
