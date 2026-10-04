---
name: nodejs-development
description: Build and design production-ready Node.js backend services and architectures. Use when creating Node.js servers, implementing middleware, deciding on framework selection, or designing REST/GraphQL APIs. Do NOT use for vanilla HTML/JS frontend tasks or network topology building.
---

# Node.js Development Patterns & Best Practices

## 1. Backend Architecture (Express/Fastify)

- Implement clean layered architecture (Routes -> Controllers -> Services -> Data Access).
- Use proper middleware patterns for validation, authentication, and error handling.

## 2. Decision Making & Principles

- Choose async/await over raw Promises or callbacks. Avoid blocking the Event Loop.
- Always implement structured logging and centralized error handling.

## Expected Output Format

Provide well-structured JavaScript/TypeScript code focusing on the specific Node.js layer requested, accompanied by a brief explanation of the architectural decision.
