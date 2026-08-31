import dotenv from 'dotenv';

dotenv.config();

const DEFAULT_CHECK_INTERVAL_MS = 5 * 60 * 1000;
const DEFAULT_CHECK_TIMEOUT_MS = 5 * 1000;
const DEFAULT_PING_TARGET_URL = 'https://1.1.1.1';
const DEFAULT_LOG_DIR = './logs';

function requireEnv(key) {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

export const config = {
  pingTargetUrl: process.env.PING_TARGET_URL || DEFAULT_PING_TARGET_URL,
  checkIntervalMs: Number(process.env.CHECK_INTERVAL_MS) || DEFAULT_CHECK_INTERVAL_MS,
  checkTimeoutMs: Number(process.env.CHECK_TIMEOUT_MS) || DEFAULT_CHECK_TIMEOUT_MS,
  logDir: process.env.LOG_DIR || DEFAULT_LOG_DIR,
  discordWebhookUrl: requireEnv('DISCORD_WEBHOOK_URL'),
};
