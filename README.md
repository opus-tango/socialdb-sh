# SocialDB

A self hosted (for now) personal CRM for managing your contacts.

NOTICE: This project is still in early alpha and is not yet ready for use.

## Description

I've had the idea for this project for over five years now, but I haven't
gotten around to building it. I've always wanted somewhere to keep track of
the people I meet and the conversations I have with them, especially those
friends who live far away and I don't see often.

There are other personal CRM tools already, including the self hostable
Monica, but none of them quite fit my needs.

## Planned Features

- [x] Better Auth for authentication
- [ ] Creating and viewing people
- [ ] Creating and viewing activities
- [ ] Creating and viewing reports
- [ ] Full markdown support for reports
- [ ] @linking people and activities in reports
- [ ] Creating and adding custom fields to people
- [ ] Tags for all objects
- [ ] Sorting and filtering all objects
- [ ] Full text search
- [ ] Vector search
- [ ] Image uploading
- [ ] Image embedding in reports
- [ ] Import and export of people as contacts
- [ ] Graph view of connections between people and reports

## Implementation

I'm using Next.js and Tailwind for the frontend because I'm familiar with them
and they're easy to use.

For the database, I'm using PostgreSQL with the pgvector extension and Drizzle ORM. For small
self hosted setups it should be PLENTY fast enough even with many thousands of people and reports.

I'm not sure about auth yet, but probably NextAuth.

## Deployment

The project is meant to be self hosted, with a single docker compose file to deploy the application and the database.
It's still in the early stages of development, so it's not yet ready for production.

I can't get file watching to work with the docker compose file, so I'm running the dev server natively, with postgres in a container.

- Use `docker comose up -d` to start the database.
- Use `docker compose exec db psql -U <POSTGRES_USER> -d <POSTGRES_DB>` to get into the database.
- Run `CREATE EXTENSION IF NOT EXISTS vector;` to create the vector extension.
- Run `pnpm dlx drizzle-kit generate` to generate the migrations.
- Run `pnpm dlx drizzle-kit migrate` to migrate the database.

## License

This project is licensed under the Mozilla Public License 2.0 - see the LICENSE file for details.

### shadcn preset

a1Ep34uG
