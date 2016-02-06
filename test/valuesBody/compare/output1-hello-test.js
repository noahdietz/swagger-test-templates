'use strict';
var chai = require('chai');
var request = require('request');

chai.should();

describe('/hello', function() {
  describe('post', function() {
    it('should respond with 200 OK', function(done) {
      request({
        url: 'http://localhost:10010/hello',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        json: {
          name: {
            id: 123,
            age: 12,
            lastName: 'Dietz'
          },
          test: 'DATA GOES HERE'
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
