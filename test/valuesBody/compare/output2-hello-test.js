'use strict';
var chai = require('chai');
var supertest = require('supertest');
var api = supertest('http://localhost:10010'); // supertest init;

chai.should();

describe('/hello', function() {
  describe('post', function() {
    it('should respond with 200 OK', function(done) {
      api.post('/hello')
      .set('Accept', 'application/json')
      .send({
        name: {
            id: 123,
            age: 12,
            lastName: 'Dietz'
          },
        test: 'DATA GOES HERE'
      })
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);

        res.body.should.equal(null); // non-json response or no schema
        done();
      });
    });

  });

});
