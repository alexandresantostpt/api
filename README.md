# tpt-api

[![Build Status](https://travis-ci.com/dextra/tpt-api.svg?token=vxnPpNeV26x68X1q2Vud&branch=master)](https://travis-ci.com/dextra/tpt-api)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/f0095b821b0a4f5f9b3028536d48f44f)](https://www.codacy.com?utm_source=github.com&utm_medium=referral&utm_content=dextra/tpt-api&utm_campaign=Badge_Grade)
[![Known Vulnerabilities](https://snyk.io/test/github/dextra/tpt-api/badge.svg)](https://snyk.io/test/github/dextra/tpt-api)
[![codecov](https://codecov.io/gh/dextra/tpt-api/branch/master/graph/badge.svg?token=GlEMvl9oez)](https://codecov.io/gh/dextra/tpt-api)

API for Teresa Perez Tours platform and mobile applications.

## Specifications

-   NodeJS
-   TypeScript

## Dependencies

-   [dotenv](https://www.npmjs.com/package/dotenv): Set differents config for each environment.
-   [file-type](https://www.npmjs.com/package/file-type): Check file type from a file.
-   [i18next](https://www.npmjs.com/package/i18next): Internacionaliation API messages.
-   [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken): Create JWT token to authentication.
-   [moment](https://www.npmjs.com/package/moment): Manipulate dates.
-   [mongo-sanitize](https://www.npmjs.com/package/mongo-sanitize): Remove inject attacks.
-   [mongoose](https://www.npmjs.com/package/mongoose): Integare with MongoDB.
-   [mongoose-seed](https://www.npmjs.com/package/mongoose-seed): Create Seeders for populate MongoDB collections.
-   [ramda](https://www.npmjs.com/package/ramda): A function lib to do some stuffs.
-   [restify](https://www.npmjs.com/package/restify): Framework to build REST API's.
-   [restify-cors-middleware](https://www.npmjs.com/package/restify-cors-middleware): Enable CORS for all requests.
-   [restify-errors](https://www.npmjs.com/package/restify-errors): Handle API errors with a nice description and status code.
-   [restify-pino-logger](https://www.npmjs.com/package/restify-pino-logger): Log all infos to ElasticSearch.
-   [restify-router](https://www.npmjs.com/package/restify-router): Define all API routes (endpoints).
-   [typescript](https://www.npmjs.com/package/typescript): A powerfull set features for JavaScript (we are using for type checker).
-   [uuid](https://www.npmjs.com/package/uuid): Generate unique ID's.
-   [validator](https://www.npmjs.com/package/validator): A library of string validators and sanitizers.

## Dev Dependencies

-   [@commitlint/cli](https://www.npmjs.com/package/@commitlint/cli): Check `commit` message.
-   [@commitlint/config-conventional](https://www.npmjs.com/package/@commitlint/config-conventional): Default configuration for `commitlint`.
-   [@mahenrique94/path-replace](https://www.npmjs.com/package/@mahenrique94/path-replace): Replace all simbolic paths for phisic.
-   [husky](https://www.npmjs.com/package/husky): Listen Github hooks.
-   [jest](https://www.npmjs.com/package/jest): Framework to run all tests.
-   [ndb](https://www.npmjs.com/package/ndb): Run node in debug mode.
-   [nodemon](https://www.npmjs.com/package/nodemon): Watch `.js` files and restart node server after changes.
-   [npm-run-all](https://www.npmjs.com/package/npm-run-all): Run some npm scripts on paralelal or cocurrent mode.
-   [pino-elasticsearch](https://www.npmjs.com/package/pino-elasticsearch): Log infos for ElasticSearch.
-   [prettier](https://www.npmjs.com/package/prettier): Automatically format codes.
-   [supertest](https://www.npmjs.com/package/supertest): Make requests inside tests.
-   [ts-jest](https://www.npmjs.com/package/ts-jest): Run `jest` with TypeScript.
-   [tsc-watch](https://www.npmjs.com/package/tsc-watch): Start TypeScript in watch mode, it has a `onSuccess` parameter.
-   [tslint](https://www.npmjs.com/package/tslint): Check pattern and sintax for all TypeScript files.

### Setup

First, you need clone the project:

```
git clone REPOSITORY_URL
```

After previous step have been done, navigate to root project directory and install all dependencies:

Using `npm`:

```
npm i
```

or, using `yarn`:

```
yarn
```

Cool, we almost there, just more a few steps.

Now, you have been finish the basic setup steps, it's possible run a few scripts, each one have your respective propose.

## Scripts

-   `build`: Generate a `dist` folder to deploy the API.
-   `check:ts`: Check if all `.ts` file it's a valid pattern.
-   `ci`: Run all tests for CI/CD integration.
-   `clean:dist:folder`: Update `dist` folder and recursive files.
-   `commitlint`: Validate the `commit` message look [.commitlintrc.json](FILE_LINK) for more info.
-   `dev`: Init a watch mode for TypeScript files.
-   `elastic:log`: Log all logs for ElasticSearch.
-   `format:ts`: Format all `.ts` files.
-   `lint`: Validate all TypeScript patterns files.
-   `link:fix`: if `lint` script has some errors, run the same script with `:fix` to try resolve all errors automatic.
-   `path:replace`: Replace all simbolic TypeScript paths for phisic one.
-   `server`: Start a development local server.
-   `server:debug`: Start a development local server in debug mode.
-   `stack:dev`: Start all Docker containers for development, including: MongoDB, ElasticSearch and Kibana.
-   `stack:dev:clean`: Remove all development Docker containers.
-   `stack:dev:start`: Start all development Docker containers.
-   `stack:dev:stop`: Stop all development Docker containers.
-   `start`: Start a development local server. (alias for `server` script).
-   `start:log`: `Start a development local server, but, logging all infos for the ElasticSearch.
-   `start:debug`: Start a development local server in debug mode. (alias for `server:debug` script).
-   `start:debug:log`: Start a development local server in debug mode, logging all infos for the ElasticSearch.
-   `ts`: Transpile and TypeScript files for JavaScript (alias for `tsc` script).
-   `ts:w`: Transpile and TypeScript files for JavaScript and lock terminal for future changes.
-   `test`: Run all tests with `.test.ts` prefix.
-   `test:w` Run all tests with `.test.ts` prefix and lock terminal for future changes.
-   `test:e2e`: Run all integration tests with `.e2e.ts` prefix and test environment.
-   `test:e2e:w` Run all integration tests with `.e2e.ts` prefix and test environment, terminal will be locket for future changes.
-   `tsc`: Transpile and TypeScript files for JavaScript.

## Starting development

To begin development, first, you need create a `.env.development` file on `root` directory of the project, you can copy `.env.example` and replaces example values for the real ones.

Second, you just need run three scripts:

```
npm run stack:dev
npm run dev
npm start
```

**Obs**: The `npm run dev` and `npm start` script's must be running in different terminal window.

Logging all infos for ElasticSearch and Kibana:

```
npm run stack:dev
npm run dev
```

Now, you need create a new index in ElasticSearch for log the application info, to create a new index access local [Kibana](http://localhost:5601).

Navigate to **Dev Tools** menu options and run:

```
PUT /pino
{
  "settings": {
    "number_of_shards": 3,
    "number_of_replicas": 0
  }
}
```

A new index will be create.

To delete a existing index run:

```
DELETE /pino
```

Now, you can start the API in log mode:

```
npm start:log
```

## Testing

To run all API tests, just run:

```
npm test
```

## Testing E2@

To run all API tests, just run:

```
npm run test:e2e
```

## Linting

To run check pattern and sintax TypeScript files, just run:

```
npm run lint
```

All scripts it can be runned with `npm` or `yarn`, feel free to use your favorite.

## Building

To create a `dist` file with `.js` files transpiled, you can run:

```
npm run build
```

When the build has been finished, a new `dist` folder must be created on `root` directory of the project.

Copyright © 2019 TPT Team
