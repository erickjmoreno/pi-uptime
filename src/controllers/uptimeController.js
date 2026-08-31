import {
  InternetStatus,
  determineTransitionEvent,
  buildBootEvent,
  buildStatusLine,
} from '../services/uptimeService.js';

/**
 * Orchestrates one monitoring "tick": check reachability, update state,
 * persist the status line, and push a notification if the state changed.
 *
 * This is the boundary layer — it is the only piece allowed to know about
 * both the network checker and the notifiers/log store at once.
 */
export class UptimeController {
  constructor({ networkChecker, notifiers, logStore }) {
    this.networkChecker = networkChecker;
    this.notifiers = notifiers;
    this.logStore = logStore;

    this.previousStatus = null;
    this.downSinceIso = null;
  }

  async notifyAll(event) {
    await Promise.allSettled(
      this.notifiers.map((notifier) => notifier.send(event)),
    );
  }

  async announceBoot() {
    const timestampIso = new Date().toISOString();
    await this.notifyAll(buildBootEvent(timestampIso));
  }

  async runCheckTick() {
    const timestampIso = new Date().toISOString();
    const isReachable = await this.networkChecker.isReachable();
    const currentStatus = isReachable ? InternetStatus.UP : InternetStatus.DOWN;

    await this.logStore.append(timestampIso, buildStatusLine({ status: currentStatus, timestampIso }));

    const transitionEvent = determineTransitionEvent({
      previousStatus: this.previousStatus,
      currentStatus,
      timestampIso,
      downSinceIso: this.downSinceIso,
    });

    if (currentStatus === InternetStatus.DOWN && this.downSinceIso === null) {
      this.downSinceIso = timestampIso;
    }

    if (currentStatus === InternetStatus.UP) {
      this.downSinceIso = null;
    }

    this.previousStatus = currentStatus;

    if (transitionEvent) {
      await this.notifyAll(transitionEvent);
    }
  }
}
