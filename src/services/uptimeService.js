export const InternetStatus = Object.freeze({
  UP: 'up',
  DOWN: 'down',
});

const MS_PER_MINUTE = 60 * 1000;

function formatDurationMinutes(durationMs) {
  const minutes = Math.max(0, Math.round(durationMs / MS_PER_MINUTE));
  return `${minutes}m`;
}

/**
 * Pure decision logic: given the previous and current reachability status,
 * decide whether a notifiable transition happened. No I/O in here.
 *
 * @param {Object} params
 * @param {string|null} params.previousStatus - InternetStatus value, or null on first run
 * @param {string} params.currentStatus - InternetStatus value
 * @param {string} params.timestampIso
 * @param {string|null} params.downSinceIso - when the outage started, if currently down
 * @returns {{type: string, message: string, timestampIso: string}|null}
 */
export function determineTransitionEvent({ previousStatus, currentStatus, timestampIso, downSinceIso }) {
  const isFirstCheck = previousStatus === null;
  const statusUnchanged = previousStatus === currentStatus;

  if (isFirstCheck || statusUnchanged) {
    return null;
  }

  if (currentStatus === InternetStatus.DOWN) {
    return {
      type: 'internet-down',
      message: `Internet DOWN as of ${timestampIso}`,
      timestampIso,
    };
  }

  const downDurationMs = downSinceIso ? new Date(timestampIso) - new Date(downSinceIso) : 0;

  return {
    type: 'internet-up',
    message: `Internet back UP as of ${timestampIso} (was down ${formatDurationMinutes(downDurationMs)})`,
    timestampIso,
  };
}

export function buildBootEvent(timestampIso) {
  return {
    type: 'boot',
    message: `Daemon started at ${timestampIso}`,
    timestampIso,
  };
}

export function buildStatusLine({ status, timestampIso }) {
  return `${timestampIso} internet=${status}`;
}
