'use strict';
var chai = require('chai');
var request = require('request');

chai.should();

require('dotenv').load();

describe('/hello', function() {
  describe('get', function() {
    it('should respond with 200 OK', function(done) {
      request({
        url: 'http://localhost:10010/hello',
        qs: {
          accessToken: process.env.KEY,
          name: 'Noah',
          test: 'DATA GOES HERE'
        },
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      },
      function(error, res, body) {
        if (error) return done(error);

        res.statusCode.should.equal(200);

        body.should.equal(null); // non-json response or no schema
        done();
      });
    });

  });

});
