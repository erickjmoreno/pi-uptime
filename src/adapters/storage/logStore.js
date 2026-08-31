import { promises as fs } from 'fs';
import path from 'path';

const LAST_LINES_DEFAULT = 100;

function datePartOf(isoTimestamp) {
  return isoTimestamp.slice(0, 10);
}

/**
 * Appends plain-text status lines to one file per day, e.g. status-2026-08-31.log
 * Daily files keep any single log small and make old logs trivial to prune.
 */
export class LogStore {
  constructor({ logDir }) {
    this.logDir = logDir;
  }

  filePathFor(isoTimestamp) {
    const fileName = `status-${datePartOf(isoTimestamp)}.log`;
    return path.join(this.logDir, fileName);
  }

  async append(isoTimestamp, line) {
    await fs.mkdir(this.logDir, { recursive: true });

    const filePath = this.filePathFor(isoTimestamp);
    await fs.appendFile(filePath, `${line}\n`, 'utf8');
  }

  async tail(count = LAST_LINES_DEFAULT) {
    const todayFilePath = this.filePathFor(new Date().toISOString());

    let fileContents;
    try {
      fileContents = await fs.readFile(todayFilePath, 'utf8');
    } catch {
      return [];
    }

    const lines = fileContents.split('\n').filter(Boolean);
    return lines.slice(-count);
  }
}
