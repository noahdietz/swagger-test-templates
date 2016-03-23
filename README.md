# Swagger Test Templates

[![Build Status](https://travis-ci.org/apigee-127/swagger-test-templates.svg?branch=master)](https://travis-ci.org/apigee-127/swagger-test-templates)

> Generate test code from a [Swagger](http://swagger.io) spec(version 2.0)

## Usage

Install via npm

```
npm install --save swagger-test-templates
```

Use your [Swagger](http://swagger.io) API spec file to generate test for your API.

```javascript
var stt = require('swagger-test-templates');
var swagger = require('/path/to/swagger.json');
var config = {
  assertionFormat: 'should',
  testModule: 'supertest',
  pathName: ['/user', '/user/{id}'],
  loadTest: [{pathName:'/user', operation:'get', load:{requests: 1000, concurrent: 100}}, { /* ... */ }],
  maxLen: 80,
  queryVals: {
    '/user': {
      name: 'John'
    }
  },
  bodyVals: {
    '/user': {
      info: {
        id: 123,
        age: 12,
        lastName: 'Doe'
      }
    }
  },
  sequences: {
    seq1: [
      {
        step: 'create',
        path: '/user',
        op: 'post'
      },
      {
        step: 'update',
        path: '/user/{id}',
        op: 'patch',
        deps: {
          'create': ['id']
        }
      },
      {
        step: 'delete',
        path: '/user/{id}',
        op: 'delete',
        deps: {
          'update': ['id']
        }
      }
    ]
  }
};

// Generates an array of JavaScript test files following specified configuration
stt.testGen(swagger, config);
```

## API

`swagger-test-templates` module exports a function with following arguments and return values:

#### Arguments
* **`assertionFormat`** *required*: One of `should`, `expect` or `assert`. Choose which assertion method should be used in output test code.
* **`testModule`** *required*: One of `supertest` or `request`. Choose between direct API calls (`request`) vs. programatic access to your API (`supertest`).
* **`pathNames`** *required*: List of path names available in your Swagger API spec used to generate tests for. Empty array leads to **all paths**.
* **`loadTest`** *optional*: List of objects info in your Swagger API spec used to generate stress tests. If specify, pathName & operation are **required**. Optional fields requests defaults to `1000`, concurrent defaults to `100`.
* **`maxLen`** *optional*: Maximum line length. Defaults to `80`.
* **`queryVals`** *optional*: Values to be populated in query string params on a path-by-path basis.
* **`bodyVals`** *optional*: Values to be populated in body params on a path-by-path basis.
* **`sequences`** *optional*: Sets of sequence tests to generate tests for.

#### Return value
An array in which each string is content of a test file and the file name. Use this information to write those files to disk.

##License
[MIT](/LICENSE)
