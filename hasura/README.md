# Hasura / Nhost setup

- Set `HASURA_GRAPHQL_DATABASE_URL` in your Hasura/Nhost project.
- Set Action env `N8N_WEBHOOK_URL` to your n8n webhook URL (e.g., `https://your-n8n-host/webhook/hasura/send-message`).
- Apply SQL from `migrations/0001_create_tables.sql` to create tables.
- Apply metadata in `metadata/` using Hasura CLI or Nhost Console.

Role permissions use only the `user` role and session var `X-Hasura-User-Id`.