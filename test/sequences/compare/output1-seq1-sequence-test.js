'use strict';
var async = require('async');
var chai = require('chai');
var ZSchema = require('z-schema');
var validator = new ZSchema({});
var request = require('request');
var deps = {};

chai.should();

require('dotenv').load();

describe('seq1 sequence test', function() {
  it('should complete the sequence without err', function(done) {
    async.series([
      function(cb) {
        /*eslint-disable*/
        var schema = {
          "type": "object",
          "properties": {
            "id": {
              "type": "number"
            },
            "loc": {
              "type": "number"
            }
          }
        };

        /*eslint-enable*/
        request({
          url: 'http://localhost:10010/',
          qs: {
            accessToken: process.env.KEY
          },
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          json: {
            name: 'DATA GOES HERE',
            age: 'DATA GOES HERE'
          }
        },
        function(error, res, body) {
          if (error) {
            return cb(new Error(error.message +
              ' | erroneous call - / POST'));
          }

          res.statusCode.should.equal(200);

          validator.validate(body, schema).should.be.true;

          deps.create = JSON.parse(body);
          cb(null);
        });

      },
      function(cb) {
        request({
          url: 'http://localhost:10010/' + deps.create.id + '/94043',
          qs: {
            accessToken: process.env.KEY,
            id: deps.create.id
          },
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        },
        function(error, res, body) {
          if (error) {
            return cb(new Error(error.message +
              ' | erroneous step - /{id}/{loc} GET'));
          }

          res.statusCode.should.equal(200);

          body.should.equal(null); // non-json response or no schema

          deps.retrieve = JSON.parse(body);
          cb(null);
        });

      },
      function(cb) {
        /*eslint-disable*/
        var schema = {
          "type": "object",
          "properties": {
            "id": {
              "type": "number"
            }
          }
        };

        /*eslint-enable*/
        request({
          url: 'http://localhost:10010/' + deps.create.id + '/94043',
          qs: {
            accessToken: process.env.KEY,
            id: deps.create.id
          },
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          json: {
            newId: 'DATA GOES HERE'
          }
        },
        function(error, res, body) {
          if (error) {
            return cb(new Error(error.message +
              ' | erroneous call - /{id}/{loc} PUT'));
          }

          res.statusCode.should.equal(200);

          validator.validate(body, schema).should.be.true;

          deps.update = JSON.parse(body);
          cb(null);
        });

      },
      function(cb) {
        request({
          url: 'http://localhost:10010/' + deps.update.id + '/94043',
          qs: {
            accessToken: process.env.KEY,
            id: deps.update.id
          },
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        },
        function(error, res, body) {
          if (error) {
            return cb(new Error(error.message
              + ' | erroneous step - /{id}/{loc} DELETE'));
          }

          res.statusCode.should.equal(200);

          body.should.equal(null); // non-json response or no schema

          deps.delete = JSON.parse(body);
          cb(null);
        });

      }
    ],
    function(err) {
      done(err);
    });
  });
});
