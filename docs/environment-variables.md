# Environment variables
## PHN QoL Survey Server Component

This document holds server configuration details, specifically the environment variables that need to be set in order for the QoL Server to operate correctly.

## Dotenv files
For testing and development, this application loads `dotenv` files, (called _dotenv_ as they refer to files named `.env` in the project's root directory). The production version of this application does not load any environment files or scripts, and expects that the production environment has the required variables in-place.

Importantly, `.env*` files are **not** version controlled as they typically contain sensitive data such as API access keys and service credentials.
 
## Testing
A comprehensive suite of tests are run when using `npm test` or `npm run test-local`. These two commands run two identical series of tests. The `npm test` command does not load any `dotenv` files, relying on the environment variables to have been exported already.

The `npm run test-local` command will attempt to load all environment variables defined in a `./.env.test-local` file (failing silently).

## Mandatory environment variables
The following environment variables are necessary for the application to function:

 * `DB_HOSTNAME` - The IP address or hostname of the PostgreSQL server.
 * `DB_USERNAME` - Postgres user with access to the database and schema.
 * `DB_PASSWORD` - Corresponding password.
 * `DB_DATABASE` - The name of the database to connect to.
 * `JWT_KEY` - A signing key for any issued JWT tokens.
 * `SERVER_URL` - Used by JWT tokens to verify issuing authenticity. If a client supplies a JWT token that bears an issuer (`payload.iss`) that is different to this environment variable, it is regarded as invalid.
 * `CLIENT_URL` - Used by JWT tokens to verify viable targets. If a client sends a request from a location other than the domain of this value (denoted in the JWT's `payload.aud`), it is regarded as invalid.
 
## Optional environment variables
These may be supplied, but if not, default values are used in their place.
 
 * `DB_SCHEMA` - The database schema to use. This may be omitted during testing, in which case a randomly generated schema name is set (and finally dropped during testing). Default auto-generated, but does not persist beyond testing (i.e., it is not exported to the shell).
 * `DB_SSL` - Defines whether the Postgres connector should use SSL. If this is `true`, then SSL is used; if not a plaintext connection will be established. Default `false`.
