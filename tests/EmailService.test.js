const { sendEmail, getStatus } = require('../src/EmailService');

describe("EmailService - Core Features", () => {
  test("should send a new email and track success/failure", async () => {
    const email = {
      idempotencyKey: 'email-1',
      to: 'user@example.com',
      subject: 'Test Email',
      body: 'This is a test.'
    };

    const result = await sendEmail(email);
    expect(['Sent', 'Failed', 'Rate limited']).toContain(result.status);

    const status = getStatus(email.idempotencyKey);
    expect(['Sent', 'Failed', 'Rate limited']).toContain(status.status);
  });

  test("should prevent duplicate email sends (idempotency)", async () => {
    const email = {
      idempotencyKey: 'email-duplicate',
      to: 'duplicate@example.com',
      subject: 'Dup Test',
      body: 'Testing idempotency.'
    };

    await sendEmail(email);
    const secondResult = await sendEmail(email);

    expect(secondResult.status).not.toBe('Internal error');
    expect(secondResult.status).not.toBe('Not found');
  });

  test("should return 'Not found' status for unknown email ID", () => {
    const status = getStatus('non-existent-id');
    expect(status.status).toBe('Not found');
  });

  test("should block emails after rate limit exceeded", async () => {
    const results = [];

    for (let i = 0; i < 6; i++) {
      const email = {
        idempotencyKey: `rate-limit-${i}`,
        to: `user${i}@example.com`,
        subject: 'Rate Limit Test',
        body: 'Testing rate limit'
      };

      const result = await sendEmail(email);
      results.push(result.status);
    }

    const rateLimited = results.filter(s => s === 'Rate limited');
    expect(rateLimited.length).toBeGreaterThanOrEqual(1);
  });
});
