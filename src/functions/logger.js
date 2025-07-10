function log(message) {
  const time = new Date().toISOString();
  console.log(`[LOG ${time}] ${message}`);
}

function error(message) {
  const time = new Date().toISOString();
  console.error(`[ERROR ${time}] ${message}`);
}

module.exports = {
  log,
  error,
};
