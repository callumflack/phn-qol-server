# PHN Quality of Life Survey

## Server component
This repo holds the server component for Primary Health Networks Quality of Life Survey. The server component has been abstracted out, and will be configured to run independently of the web front-end or any subsequent incarnation of the survey itself (regional versions of the survey, mobile apps, embedded IoT instances, etc.)

## Technology stack
This is an [Express](http://expressjs.com/) application running on [Node.js](https://nodejs.org/en/). RDMBS [Postgres](http://www.postgresql.org/) has been chosen for its performance, scalability and maturity.

The server is an implementation of REST, issuing [JWT](https://jwt.io/) tokens for client registration and responding in JSON format. GET, POST and HEAD commands will be the primary interface for interacting with the server and subsequently manipulating data. HTTP response codes will bear a significance with every HTTP request and error massaging will be minimal.

There is no front-end for this server instance- please see the API documentation for usage details.

## Data definition
![Entity-Relationship Diagram](docs/database/entity-relationship-diagram.png)

Assumptions have been made regarding the data collected during the device registration process and supplied by PHN for each provider.

## Instances
This web application will be split across multiple instances, `development`, `staging` and `master` for deployment. Each of these instances has a separate endpoint and dataset, and synchronisation between instances will be managed using git branching.

### Branch `master` [![`master` Heroku status](https://heroku-badge.herokuapp.com/?app=phn-qol-survey&style=flat)](https://phn-qol-survey.herokuapp.com/) [![Circle CI](https://circleci.com/gh/patternworks/phn-qol-server/tree/master.svg?style=shield&circle-token=c1de633e983c8635491f69a5537b68987b23d006)](https://circleci.com/gh/patternworks/phn-qol-server/tree/master)
The master branch is the production version of the web application, hosted on the main domain. Any commits to master which is then pushed to GitHub will trigger a Circle CI build. If the build passess successfully, then the changes will automatically be deployed to the production site.

### Branch `staging` [![`staging` Heroku status](https://heroku-badge.herokuapp.com/?app=phn-qol-survey-staging&style=flat)](https://phn-qol-survey-staging.herokuapp.com/) [![Circle CI](https://circleci.com/gh/patternworks/phn-qol-server/tree/staging.svg?style=shield&circle-token=c1de633e983c8635491f69a5537b68987b23d006)](https://circleci.com/gh/patternworks/phn-qol-server/tree/staging)
The staging branch is used to manage changes that are ready for or pending preparation for deployment to the `master` branch. The deployment process for the staging branch is identical to that of the master branch (although deployment is sent to a different domain name).

### Branch `development` [![`development` Heroku status](https://heroku-badge.herokuapp.com/?app=phn-qol-survey-development&style=flat)](https://phn-qol-survey-development.herokuapp.com/) [![Circle CI](https://circleci.com/gh/patternworks/phn-qol-server/tree/development.svg?style=shield&circle-token=c1de633e983c8635491f69a5537b68987b23d006)](https://circleci.com/gh/patternworks/phn-qol-server/tree/development)
The development (_dev_) branch is used to synchronise development and feature extensions between collaborators. At present, the dev repository is being used to effect Circle CI integration. It may or may not survive v1.0 but nonetheless is automated for continuous delivery during development.

## Testing
As we're using [CircleCI](https://circleci.com/dashboard) for continuous delivery (CD; aka continuous Integration (CI)), testing; and importantly: extensive testing, is a crucial feature of this webapp. The way CI has been set up, if a single test fails, the application will **not** be deployed to the server.

As an API server, most of the testing that is conducted can be automated and for that we use the [Mocha](https://mochajs.org/) testing framework, along with [Chai](http://chaijs.com/) assertion library and [SuperTest](https://github.com/visionmedia/supertest). There are broadly three categories of testing that takes place: unit testing, integration testing and system testing.

### Running tests
Please see the [Environment Variables documentation](./docs/environment-variables.md) for the environment variable requirements for test execution.

Once the environment has all the requisite environment variables, the following commands may be used to test the server:

 * `npm test` - Uses the existing environment variables.
 * `npm run test-local` - loads any environment variables configured in a `./.env.test-local` file before continuing to run the same tests.

### Unit Testing
Unit tests are arranged into their components within the `unit/` directory. By definition, these tests should operate on individual components, treating them as a black box to observe their behaviour. For a given input, there will be an expeted output and most discrete tests will simply compare the actual output to an expected output for a corresponding input.

Typically the unit being tested will be a single JavaScript file (imported or required in), and all tests that apply to that file will be stored in a similarly-named file within the `test/` directory. Please note, whilst the JavaScript files being tested may import their own libraries, a unit test suite for that file will only be concerned with the methods exported by the module, and not the libraries being used.

### Integration testing
Integration tests can be found in the `integration/` directory. They are similar to unit tests however observe the behaviours of systems where multiple files or libraries are coordinated to produce an output. Typically, this will be testing the Express.js server to see that a given HTTP request produces an expected response (either header information, body information or both).

### System testing
A higher-level suite of tests exist in the `system/` directory, responsible for verifying that the necessary parts of the system are online and working. An example of this may be confirmation of database connectivity, SQL script execution, etc.

# License
Copyright (c) Patternworks 2016, All rights reserved. Unauthorised copying of this file, via any medium is strictly prohibited. Proprietary and confidential. Written by Kashi Samaraweera &lt;kashi@kashis.com.au&gt;.
