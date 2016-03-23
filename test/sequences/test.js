/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Apigee Corporation
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

var assert = require('chai').assert;
var testGen = require('../../index.js').testGen;
var swagger = require('./swagger.json');
var linter = require('eslint').linter;
var yaml = require('js-yaml');
var join = require('path').join;
var rules;
var read = require('fs').readFileSync;

rules = yaml.safeLoad(read(join(__dirname, '/../../.eslintrc'), 'utf8'));
rules.env = {mocha: true};

describe('sequence test generation', function() {
  describe('request', function() {
    var output1 = testGen(swagger, {
      testModule: 'request',
      assertionFormat: 'should',
      pathName: ['/'],
      pathParams: {
        loc: 94043
      },
      sequences: {
        seq1: [
          {
            step: 'create',
            path: '/',
            op: 'post'
          },
          {
            step: 'retrieve',
            path: '/{id}/{loc}',
            op: 'get',
            deps: {
              create: 'id'
            }
          },
          {
            step: 'update',
            path: '/{id}/{loc}',
            op: 'put',
            deps: {
              create: 'id'
            }
          },
          {
            step: 'delete',
            path: '/{id}/{loc}',
            op: 'delete',
            deps: {
              update: 'id'
            }
          }
        ]
      }
    });

    var paths1 = [];
    var ndx;

    for (ndx in output1) {
      if (output1 && output1[ndx].name !== '.env') {
        paths1.push(join(__dirname, '/compare/output1-' + output1[ndx].name));
      }
    }

    it('should generate valid sequence tests', function() {

      assert.isArray(output1);
      assert.lengthOf(output1, 3);

      var generatedCode;

      for (ndx in paths1) {
        if (paths1 !== undefined) {
          generatedCode = read(paths1[ndx], 'utf8');
          assert.equal(output1[ndx].test, generatedCode);
        }
      }

      for (ndx in output1) {
        if (output1 !== undefined && output1[ndx].name !== '.env') {
          assert.lengthOf(linter.verify(output1[ndx].test, rules), 0);
        }
      }
    });
  });

  describe('supertest', function() {
    var output2 = testGen(swagger, {
      testModule: 'supertest',
      assertionFormat: 'should',
      pathName: ['/'],
      sequences: {
        seq1: [
          {
            step: 'create',
            path: '/',
            op: 'post'
          },
          {
            step: 'retrieve',
            path: '/{id}/{loc}',
            op: 'get',
            deps: {
              create: 'id'
            }
          },
          {
            step: 'update',
            path: '/{id}/{loc}',
            op: 'put',
            deps: {
              create: 'id'
            }
          },
          {
            step: 'delete',
            path: '/{id}/{loc}',
            op: 'delete',
            deps: {
              update: 'id'
            }
          }
        ]
      }
    });

    var paths2 = [];
    var ndx;

    for (ndx in output2) {
      if (output2 && output2[ndx].name !== '.env') {
        paths2.push(join(__dirname, '/compare/output2-' + output2[ndx].name));
      }
    }

    it('should generate valid sequence tests', function() {

      assert.isArray(output2);
      assert.lengthOf(output2, 3);

      var generatedCode;

      for (ndx in paths2) {
        if (paths2 !== undefined) {
          generatedCode = read(paths2[ndx], 'utf8');
          assert.equal(output2[ndx].test, generatedCode);
        }
      }

      for (ndx in output2) {
        if (output2 !== undefined && output2[ndx].name !== '.env') {
          assert.lengthOf(linter.verify(output2[ndx].test, rules), 0);
        }
      }
    });
  });
});