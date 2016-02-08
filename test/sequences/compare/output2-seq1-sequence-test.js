'use strict';
var async = require('async');
var chai = require('chai');
var ZSchema = require('z-schema');
var validator = new ZSchema({});
var supertest = require('supertest');
var api = supertest('http://localhost:10010'); // supertest init;
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
          if (err) {
            return cb(new Error(err.message +
              ' | erroneous call - / POST'));
          }

          validator.validate(res.body, schema).should.be.true;

          deps.create = res.body;
          cb(null);
        });

      },
      function(cb) {
        api.get('/' + deps.create.id + '/{loc PARAM GOES HERE}')
        .query({
          accessToken: process.env.KEY,
          id: deps.create.id
        })
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res) {
          if (err) {
            return cb(new Error(err.message +
              ' | erroneous step - /{id}/{loc} GET'));
          }

          res.body.should.equal(null); // non-json response or no schema

          deps.retrieve = res.body;
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
        api.put('/' + deps.create.id + '/{loc PARAM GOES HERE}')
        .query({
          accessToken: process.env.KEY,
          id: deps.create.id
        })
        .set('Accept', 'application/json')
        .send({
          newId: 'DATA GOES HERE'
        })
        .expect(200)
        .end(function(err, res) {
          if (err) {
            return cb(new Error(err.message +
              ' | erroneous call - /{id}/{loc} PUT'));
          }

          validator.validate(res.body, schema).should.be.true;

          deps.update = res.body;
          cb(null);
        });

      },
      function(cb) {
        api.del('/' + deps.update.id + '/{loc PARAM GOES HERE}')
        .query({
          accessToken: process.env.KEY,
          id: deps.update.id
        })
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res) {
          if (err) {
            return cb(new Error(err.message +
              ' | erroneous step - /{id}/{loc} DELETE'));
          }

          res.body.should.equal(null); // non-json response or no schema

          deps.delete = res.body;
          cb(null);
        });

      }
    ],
    function(err) {
      done(err);
    });
  });
});
