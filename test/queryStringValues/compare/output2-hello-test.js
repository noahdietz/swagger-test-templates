'use strict';
var chai = require('chai');
var supertest = require('supertest');
var api = supertest('http://localhost:10010'); // supertest init;

chai.should();

require('dotenv').load();

describe('/hello', function() {
  describe('get', function() {
    it('should respond with 200 OK', function(done) {
      api.get('/hello')
      .query({
        accessToken: process.env.KEY,
        name: 'Noah',
        test: 'DATA GOES HERE'
      })
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);

        res.body.should.equal(null); // non-json response or no schema
        done();
      });
    });

  });

});
