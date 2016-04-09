# PHN Quality of Life Survey
## Server component
This repo holds the server component for Primary Health Networks Quality of Life Survey. The server component has been abstracted out, and will be configured to run independently of the web front-end or any subsequent incarnation of the survey itself (regional versions of the survey, mobile apps, embedded IoT instances, etc.)

## Technology stack
This is an [Express](http://expressjs.com/) application running on [Node.js](https://nodejs.org/en/). RDMBS [Postgres](http://www.postgresql.org/) has been chosen for its performance, scalability and maturity.

The server is an implementation of REST, issuing [JWT](https://jwt.io/) tokens for client registration and responding in JSON format. GET, POST and HEAD commands will be the primary interface for interacting with the server and subsequently manipulating data. HTTP response codes will bear a significance with every HTTP request and error massaging will be minimal.

There is no front-end for this server instance- please see the API documentation for usage details.

# License
Copyright (c) Patternworks, All rights reserved Unauthorised copying of this file, via any medium is strictly prohibited. Proprietary and confidential. Written by Kashi Samaraweera &lt;kashi@kashis.com.au&gt;, 2016.
