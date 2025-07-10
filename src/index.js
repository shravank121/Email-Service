const express = require('express');
const { sendEmail, getStatus } = require('./EmailService');
const logger = require('./functions/logger');
const { addToQueue } = require('./functions/queue');

const app = express();
app.use(express.json());

// POST /send
app.post('/send', async (req, res) => {
  try {
    const email = req.body;
    const id = email.idempotencyKey;

    // Basic input validation
    if (!email.to || !email.subject || !email.body || !id) {
      return res.status(400).json({ status: 'Invalid input: Missing fields' });
    }

    // ✅ Idempotency check before queueing
    const existingStatus = getStatus(id);
    if (existingStatus && existingStatus.status === 'Sent') {
      logger.log(`[API] Duplicate request: ${id}`);
      return res.status(200).json(existingStatus);
    }

    // ✅ Add to background queue
    addToQueue(async () => {
      await sendEmail(email);
    });

    logger.log(`[API] Email task queued: ${id}`);
    return res.status(202).json({
      status: 'Queued',
      idempotencyKey: id,
    });

  } catch (err) {
    logger.error('[POST /send Error]:', err.message);
    return res.status(500).json({ status: 'Internal server error' });
  }
});

// GET /status/:id
app.get('/status/:id', (req, res) => {
  try {
    const id = req.params.id;
    const result = getStatus(id);
    return res.status(200).json(result);
  } catch (err) {
    logger.error('[GET /status Error]:', err.message);
    return res.status(500).json({ status: 'Internal server error' });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.log(`Server running at http://localhost:${PORT}`);
});
