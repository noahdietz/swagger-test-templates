'use strict';
var chai = require('chai');
var ZSchema = require('z-schema');
var validator = new ZSchema({});
var request = require('request');

chai.should();

require('dotenv').load();

describe('/', function() {
  describe('post', function() {
    it('should respond with 200 OK', function(done) {
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
        if (error) return done(error);

        res.statusCode.should.equal(200);

        validator.validate(body, schema).should.be.true;
        done();
      });
    });

  });

});
