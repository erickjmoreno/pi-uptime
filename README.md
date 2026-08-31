# pi-uptime

Lightweight Raspberry Pi daemon that tracks internet reachability and pushes
Discord alerts when it changes. Also logs boot events, which act as a proxy
for power-loss/crash detection: a boot message with no prior graceful
shutdown implies the Pi lost power or crashed.

## How it works

Every `CHECK_INTERVAL_MS` (default 5 min):
1. `HttpNetworkChecker` sends an HTTPS HEAD request to `PING_TARGET_URL`.
2. `UptimeController` records the result as a line in `logs/status-YYYY-MM-DD.log`.
3. If the status flipped since the last check, a Discord alert is pushed.

On process start, a boot event is pushed to Discord immediately.

## Architecture

```
index.js                          entrypoint, wires everything, PM2 target
src/config.js                     env var loading + validation
src/controllers/uptimeController.js   orchestration: check -> log -> notify
src/services/uptimeService.js         pure logic: transition detection, formatting
src/adapters/network/httpNetworkChecker.js   reachability check (swappable)
src/adapters/notifiers/discordNotifier.js    Discord webhook push (swappable)
src/adapters/storage/logStore.js             plain-text status log (daily files)
```

Adding a channel (Discord bot, WhatsApp, etc.) means writing a new class
implementing `Notifier` and registering it in `index.js` — no other file
changes. Adding a pull-based `/status` command means reading `logStore.tail()`
from a new controller — the service layer doesn't change.

## Setup

```bash
cp .env.example .env
# edit .env: set DISCORD_WEBHOOK_URL

npm install
pm2 start ecosystem.config.js
pm2 save
pm2 startup   # follow the printed command to persist across reboots
```

## Logs

Plain text, one file per day, in `logs/`:

```
2026-08-31T14:05:00.000Z internet=up
2026-08-31T14:10:00.000Z internet=down
```
