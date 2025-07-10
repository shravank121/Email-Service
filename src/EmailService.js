const EmailProviderA = require('./providers/EmailProviderA');
const EmailProviderB = require('./providers/EmailProviderB');
const logger = require('./functions/logger');
const rateLimiter = require("./functions/rateLimiter")

// In-memory state
const sentEmails = new Set();           // For idempotency
const emailStatus = {};                 // Tracks status by idempotencyKey

// Instantiate providers (they're classes, but that's fine)
const providerA = new EmailProviderA(); // forceFail: true inside
const providerB = new EmailProviderB(); // forceFail: false inside
const providers = [providerA, providerB];

// Retry with exponential backoff
async function retryWithBackoff(fn, retries = 3) {
  let delay = 500;

  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === retries - 1) throw err;
      logger.log(`Retry attempt ${i + 1}, retrying in ${delay}ms...`);
      await new Promise((res) => setTimeout(res, delay));
      delay *= 2;
    }
  }
}

// Core function to send email
async function sendEmail(email) {
    const id = email.idempotencyKey;
    logger.log(`sendEmail() started for: ${id}`);
  
    try {
      // Idempotency check
      if (sentEmails.has(id)) {
        logger.log(`[Idempotent] Already sent: ${id}`);
        return emailStatus[id];
      }
  
      // Rate limiting
      if (!rateLimiter.isAllowed()) {
        const status = { status: 'Rate limited' };
        emailStatus[id] = status;
        logger.log(`[Rate Limit] Blocked: ${id}`);
        return status;
      }
  
      // Try sending with each provider
      for (let i = 0; i < providers.length; i++) {
        try {
          const response = await retryWithBackoff(() =>
            providers[i].send(email)
          );
  
          const status = {
            status: 'Sent',
            provider: response.provider,
            message: response.message,
          };
  
          sentEmails.add(id);
          emailStatus[id] = status;
          logger.log(`[Success] Sent via ${response.provider}`);
          logger.log(`sendEmail() finished for: ${id}`);
          return status;
  
        } catch (providerErr) {
          logger.error(`[Provider ${i + 1} Failed]: ${providerErr.message}`);
          continue; // Try next provider
        }
      }
  
      // If all fail
      const failStatus = { status: 'Failed', message: 'All providers failed' };
      emailStatus[id] = failStatus;
      logger.log(`sendEmail() finished for: ${id} — all providers failed`);
      return failStatus;
  
    } catch (err) {
      logger.error(`[EmailService Error]: ${err.message}`);
      return { status: 'Internal error' };
    }
  }
  
  function getStatus(id) {
    try {
      return emailStatus[id] || { status: 'Not found' };
    } catch (err) {
      logger.error('[Status Error]:', err.message);
      return { status: 'Error retrieving status' };
    }
  }
  
  module.exports = {
    sendEmail,
    getStatus,
  };
  
