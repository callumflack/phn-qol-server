# PHN Quality of Life Survey
## Server component
This repo holds the server component for Primary Health Networks Quality of Life Survey. The server component has been abstracted out, and will be configured to run independently of the web front-end or any subsequent incarnation of the survey itself (regional versions of the survey, mobile apps, embedded IoT instances, etc.)

## Technology stack
This is an [Express](http://expressjs.com/) application running on [Node.js](https://nodejs.org/en/). RDMBS [Postgres](http://www.postgresql.org/) has been chosen for its performance, scalability and maturity.

The server is an implementation of REST, issuing [JWT](https://jwt.io/) tokens for client registration and responding in JSON format. GET, POST and HEAD commands will be the primary interface for interacting with the server and subsequently manipulating data. HTTP response codes will bear a significance with every HTTP request and error massaging will be minimal.

There is no front-end for this server instance- please see the API documentation for usage details.

## Data definition
![Entity-Relationship Diagram](phn-qol-server/docs/database/entity-relationship-diagram.png)

Assumptions have been made regarding the data collected during the device registration process and supplied by PHN for each provider.

## Instances
This web application will be split across multiple instances, `development`, `staging` and `master` for deployment. Each of these instances has a separate endpoint and dataset, and synchronisation between instances will be managed using git branching.

### Branch `master` ([https://phn-qol-survey.herokuapp.com/](https://phn-qol-survey.herokuapp.com/))
The master branch is the production version of the web application, hosted on the main domain. Any commits to master which is then pushed to GitHub will trigger a Circle CI build. If the build passess successfully, then the changes will automatically be deployed to the production site.

### Branch `staging` ([https://phn-qol-survey-staging.herokuapp.com/](https://phn-qol-survey-staging.herokuapp.com/))
The staging branch is used to manage changes that are ready for or pending preparation for deployment to the `master` branch. The deployment process for the staging branch is identical to that of the master branch (although deployment is sent to a different domain name).

### Branch `development` ([https://phn-qol-survey-development.herokuapp.com/](https://phn-qol-survey-development.herokuapp.com/))
The development (_dev_) branch is used to synchronise development and feature extensions between collaborators. At present, the dev repository is being used to effect Circle CI integration. It may or may not survive v1.0 but nonetheless is automated for continuous delivery during development.

# License
Copyright (c) Patternworks, All rights reserved Unauthorised copying of this file, via any medium is strictly prohibited. Proprietary and confidential. Written by Kashi Samaraweera &lt;kashi@kashis.com.au&gt;, 2016.
