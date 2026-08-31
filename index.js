import { config } from './src/config.js';
import { UptimeController } from './src/controllers/uptimeController.js';
import { HttpNetworkChecker } from './src/adapters/network/httpNetworkChecker.js';
import { DiscordNotifier } from './src/adapters/notifiers/discordNotifier.js';
import { LogStore } from './src/adapters/storage/logStore.js';

const networkChecker = new HttpNetworkChecker({
  targetUrl: config.pingTargetUrl,
  timeoutMs: config.checkTimeoutMs,
});

const notifiers = [
  new DiscordNotifier({ webhookUrl: config.discordWebhookUrl }),
];

const logStore = new LogStore({ logDir: config.logDir });

const uptimeController = new UptimeController({ networkChecker, notifiers, logStore });

async function start() {
  await uptimeController.announceBoot();
  await uptimeController.runCheckTick();

  setInterval(() => {
    uptimeController.runCheckTick().catch((error) => {
      console.error('Check tick failed:', error);
    });
  }, config.checkIntervalMs);
}

start().catch((error) => {
  console.error('Failed to start pi-uptime:', error);
  process.exit(1);
});
