'use strict';

const rateLimit = require('express-rate-limit');

/**
 * Multi-Instance Deployment with Redis (Horizontal Scaling):
 *
 * Why MemoryStore fails in production:
 * By default, express-rate-limit uses an in-memory store (MemoryStore), which keeps
 * the request counter in the individual Node.js process memory. In a multi-instance
 * production deployment behind a load balancer, each instance maintains its own separate
 * counter. An attacker whose requests are distributed across N instances effectively gets
 * N times the limit (e.g., 5 attempts * 3 instances = 15 attempts).
 *
 * How a Redis-backed store solves this:
 * By configuring a shared Redis store (e.g., using `rate-limit-redis`), all instances
 * check and increment a single shared counter in Redis atomically. This ensures that the
 * rate limit (5 attempts per 15 minutes) is enforced uniformly across the entire cluster,
 * regardless of which instance handles each request.
 *
 * Example Redis configuration:
 *   const { RedisStore } = require('rate-limit-redis');
 *   // store: new RedisStore({
 *   //   sendCommand: (...args) => redisClient.sendCommand(args),
 *   // }),
 */

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window per IP
  skipSuccessfulRequests: true, // Only failed attempts count
  standardHeaders: true, // Return standard RateLimit-* headers
  legacyHeaders: false, // Disable legacy X-RateLimit-* headers
});

module.exports = authLimiter;
