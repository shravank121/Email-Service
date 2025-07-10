EmailService
A robust and modular Node.js-based email delivery service built with extensibility and reliability in mind. This service integrates multiple mock email providers and includes core reliability features such as retry mechanisms, provider fallback, idempotency, rate limiting, and status tracking. It is suitable for demonstration, testing, or as a blueprint for production-level implementations.

Features
Retry with Exponential Backoff: Ensures reliability by attempting retries with increasing delays.

Provider Fallback: Automatically switches to a secondary provider if the primary fails.

Idempotency: Prevents duplicate email sending when the same request is retried.

Basic Rate Limiting: Restricts sending volume to avoid abuse and control load.

Status Tracking: Provides a way to query the status of past send attempts.

Queue System: Tasks are processed sequentially to simulate load-handling.

Circuit Breaker Pattern (Basic): Helps avoid hammering failing services.

Simple Logging: Outputs consistent and timestamped logs for observability.

Project Structure
bash
Copy
Edit
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
├── README.md
├── package.json
└── .gitignore
Getting Started
Prerequisites
Node.js v18 or higher

npm installed globally

Installation
bash
Copy
Edit
git clone https://github.com/shravank121/EmailService.git
cd EmailService
npm install
Usage
Start the Server
bash
Copy
Edit
node src/index.js
The server will start at http://localhost:3000.

POST /send
Submit an email send request.

Request Body:

json
Copy
Edit
{
  "to": "recipient@example.com",
  "subject": "Test Email",
  "body": "This is a test email body",
  "idempotencyKey": "unique-request-id"
}
Response:

json
Copy
Edit
{
  "message": "Email task queued",
  "idempotencyKey": "unique-request-id"
}
GET /status/:id
Check the status of a previously submitted email by its idempotencyKey.

Example:

http
Copy
Edit
GET /status/unique-request-id
Response:

json
Copy
Edit
{
  "status": "Sent",
  "provider": "ProviderB",
  "message": "Email sent successfully"
}
Rate Limiting
The service is rate-limited to 5 emails per minute.

Exceeding this limit will result in a status response: { "status": "Rate limited" }.

Idempotency
The system ensures that email with the same idempotencyKey is only processed once, regardless of how many times it is queued or posted.

Testing
This project uses mock providers to simulate real-world failures.

Unit tests can be added using mocha, jest, or any other test runner. Mocks are encouraged for provider behavior.

Configuration
You can tweak rate limits, retry counts, or provider fail behavior inside:

functions/rateLimiter.js

EmailProviderA.js (modify forceFail)

queue.js (simulate delays or failures)

License
This project is provided for educational and demonstration purposes. No actual emails are sent.
