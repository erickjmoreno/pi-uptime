/**
 * Reachability check via HTTPS HEAD request.
 * Chosen over raw ICMP ping because it needs no elevated privileges
 * and still works on networks that block ICMP.
 */
export class HttpNetworkChecker {
  constructor({ targetUrl, timeoutMs }) {
    this.targetUrl = targetUrl;
    this.timeoutMs = timeoutMs;
  }

  async isReachable() {
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), this.timeoutMs);

    try {
      const response = await fetch(this.targetUrl, {
        method: 'HEAD',
        signal: abortController.signal,
      });

      return response.ok || response.status < 500;
    } catch {
      return false;
    } finally {
      clearTimeout(timeoutId);
    }
  }
}
