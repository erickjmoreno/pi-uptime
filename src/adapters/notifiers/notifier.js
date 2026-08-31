/**
 * Notifier contract every push channel (Discord, WhatsApp, ...) must satisfy.
 * `uptimeController` depends only on this shape, never on a concrete channel.
 *
 * @typedef {Object} NotificationEvent
 * @property {string} type - e.g. 'internet-up', 'internet-down', 'boot'
 * @property {string} message - human-readable text to display
 * @property {string} timestampIso - ISO 8601 timestamp of the event
 */
export class Notifier {
  /**
   * @param {NotificationEvent} event
   * @returns {Promise<void>}
   */
  // eslint-disable-next-line no-unused-vars
  async send(event) {
    throw new Error('Notifier.send() must be implemented by subclass');
  }
}
