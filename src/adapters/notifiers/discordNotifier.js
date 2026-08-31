import { Notifier } from './notifier.js';

const DISCORD_EVENT_ICONS = {
  'internet-up': '🟢',
  'internet-down': '🔴',
  boot: '🟡',
};

export class DiscordNotifier extends Notifier {
  constructor({ webhookUrl }) {
    super();
    this.webhookUrl = webhookUrl;
  }

  async send(event) {
    const icon = DISCORD_EVENT_ICONS[event.type] || 'ℹ️';

    const response = await fetch(this.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: `${icon} ${event.message}` }),
    });

    if (!response.ok) {
      throw new Error(`Discord webhook responded with status ${response.status}`);
    }
  }
}
