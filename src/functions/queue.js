const logger = require('./logger');

const queue = [];
let isRunning = false;

async function processQueue() {
  if (isRunning || queue.length === 0) return;

  isRunning = true;
  const task = queue.shift();

  try {
    await task(); // Run the task (which will call sendEmail)
    logger.log('[Queue] Task completed');
  } catch (err) {
    logger.error('[Queue] Task failed:', err.message);
  }

  isRunning = false;
  processQueue(); // Process next task
}

function addToQueue(taskFn) {
  try {
    queue.push(taskFn);
    logger.log('[Queue] Task added');
    processQueue();
  } catch (err) {
    logger.error('[Queue] Error adding task:', err.message);
    throw err; // Re-throw to hit the /send route's catch block
  }
}

module.exports = {
  addToQueue,
};
