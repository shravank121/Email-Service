// functions/rateLimiter.js

let requests = [];
const LIMIT = 5; // Allow 5 emails per minute
const WINDOW_MS = 60 * 1000;

function isAllowed() {
  const now = Date.now();

  // Remove timestamps outside the window
  requests = requests.filter((t) => now - t < WINDOW_MS);

  if (requests.length < LIMIT) {
    requests.push(now);
    return true;
  }

  return false;
}

module.exports = {
  isAllowed, // ✅ named export — needed to support rateLimiter.isAllowed()
};
