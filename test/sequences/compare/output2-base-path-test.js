'use strict';
var chai = require('chai');
var ZSchema = require('z-schema');
var validator = new ZSchema({});
var supertest = require('supertest');
var api = supertest('http://localhost:10010'); // supertest init;

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
      api.post('/')
      .query({
        accessToken: process.env.KEY
      })
      .set('Accept', 'application/json')
      .send({
        name: 'DATA GOES HERE',
        age: 'DATA GOES HERE'
      })
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);

        validator.validate(res.body, schema).should.be.true;
        done();
      });
    });

  });

});
