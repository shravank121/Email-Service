# EmailService

A robust and modular Node.js-based email delivery service built with extensibility and reliability in mind. This service integrates multiple mock email providers and includes core reliability features such as retry mechanisms, provider fallback, idempotency, rate limiting, and status tracking. It is suitable for demonstration, testing, or as a blueprint for production-level implementations.

---

## Features

* **Retry with Exponential Backoff** – Ensures reliability by attempting retries with increasing delays.
* **Provider Fallback** – Automatically switches to a secondary provider if the primary fails.
* **Idempotency** – Prevents duplicate email sending when the same request is retried.
* **Basic Rate Limiting** – Restricts sending volume to avoid abuse and control load.
* **Status Tracking** – Provides a way to query the status of past send attempts.
* **Queue System** – Tasks are processed sequentially to simulate load-handling.
* **Circuit Breaker Pattern (Basic)** – Helps avoid hammering failing services.
* **Simple Logging** – Outputs consistent and timestamped logs for observability.

---

## Project Structure

```
EmailService/
├── src/
│   ├── index.js               # Entry point and Express server
│   ├── EmailService.js        # Core service logic
│   ├── queue.js               # Simple task queue
│   ├── functions/
│   │   ├── logger.js          # Centralized logging
│   │   └── rateLimiter.js     # In-memory rate limiting
│   └── providers/
│       ├── EmailProviderA.js  # Mock provider A (can be forced to fail)
│       └── EmailProviderB.js  # Mock provider B (backup)
├── tests/
│   └── EmailService.test.js   # Unit tests for core features
├── README.md
├── package.json
└── .gitignore
```

---

## Getting Started

### Prerequisites

* Node.js v18 or higher
* npm installed globally

### Installation

```bash
git clone https://github.com/your-username/EmailService.git
cd EmailService
npm install
```

---

## Usage

### Start the Server

```bash
node src/index.js
```

The server will start at: `http://localhost:3000`

---

### POST `/send`

Submit an email send request.

**Request Body:**

```json
{
  "to": "recipient@example.com",
  "subject": "Test Email",
  "body": "This is a test email body",
  "idempotencyKey": "unique-request-id"
}
```

**Response:**

```json
{
  "message": "Email task queued",
  "idempotencyKey": "unique-request-id"
}
```

---

### GET `/status/:id`

Check the status of a previously submitted email using the `idempotencyKey`.

**Example:**

```http
GET /status/unique-request-id
```

**Response:**

```json
{
  "status": "Sent",
  "provider": "ProviderB",
  "message": "Email sent successfully"
}
```

---

## Rate Limiting

* The service is rate-limited to **5 emails per minute**.
* If this threshold is exceeded, requests will be blocked with:

```json
{
  "status": "Rate limited"
}
```

---

## Idempotency

If an email with the same `idempotencyKey` is posted multiple times, only the first request will be processed. All duplicates will return the original result without reprocessing.

---

## Testing

This project uses the **Jest** testing framework.

* All tests are located in `tests/EmailService.test.js`
* Tests validate:

  * Email sending and fallback logic
  * Retry mechanism
  * Idempotency behavior
  * Rate limiting enforcement
  * Status tracking responses

### Run Tests

```bash
npm test
```

Test logs are output to console with status for each scenario.

---

## Configuration

* Modify retry logic inside `EmailService.js`
* Tweak rate limits in `functions/rateLimiter.js`
* Simulate provider failures in `providers/EmailProviderA.js`

---

## License

This project is intended for educational and demonstration purposes. No real emails are sent.
