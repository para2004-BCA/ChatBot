# Chatbot with Nhost Auth, Hasura GraphQL, Hasura Actions, and n8n

This app is a React + Vite frontend that uses Nhost for Auth and Hasura GraphQL, with an n8n workflow powering a chatbot via a Hasura Action and OpenRouter.

## Quick start

1. Copy env and set your Nhost project URL:

```bash
cp .env.example .env
# Edit .env: set VITE_NHOST_BACKEND_URL to your Nhost backend URL
```

2. Install and run locally:

```bash
npm install
npm run dev
```

3. Build for Netlify:

```bash
npm run build
```

## Backend setup

- Apply SQL and Hasura metadata in `hasura/` to your Nhost project's Hasura instance.
- Import the n8n workflow JSON in `n8n/` and set credentials (Hasura Admin Secret, OpenRouter API key). Ensure the webhook URL is reachable; use it in the Hasura Action handler config.

## GraphQL-only frontend

The frontend uses only GraphQL queries, mutations, and subscriptions. All external API calls (OpenRouter) are made inside n8n, never from the frontend.
