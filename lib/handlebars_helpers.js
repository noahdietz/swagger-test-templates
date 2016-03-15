'use strict';

var _ = require('lodash');
var strObj = require('string');
var url = require('url');
var TYPE_JSON = 'application/json';
var len;

module.exports = {
  is: is,
  ifCond: ifCond,
  validateResponse: validateResponse,
  extractPath: extractPath,
  length: length,
  pathify: pathify,
  querify: querify,
  bodify: bodify,
  setLen: setLen
}

/**
 * setter for the maximum length of a description
 * @param {integer} val maximum desription length
 */
function setLen(val) {
  len = val;
}

// http://goo.gl/LFoiYG
function is(lvalue, rvalue, options) {
  if (arguments.length < 3) {
    throw new Error('Handlebars Helper \'is\' needs 2 parameters');
  }

  if (lvalue !== rvalue) {
    return options.inverse(this);
  } else {
    return options.fn(this);
  }
}

// http://goo.gl/LFoiYG
function ifCond(v1, v2, options) {
  if (arguments.length < 3) {
    throw new Error('Handlebars Helper \'ifCond\' needs 2 parameters');
  }
  if (v1.length > 0 || v2) {
    return options.fn(this);
  }
  return options.inverse(this);
}

/**
 * determines if content types are able to be validated
 * @param  {string} type     content type to be evaluated
 * @param  {boolean} noSchema whether or not there is a defined schema
 * @param  {Object} options  handlebars built-in options
 * @returns {boolean}          whether or not the content can be validated
 */
function validateResponse(type, noSchema, options) {
  if (arguments.length < 3) {
    throw new Error('Handlebars Helper \'validateResponse\'' +
      'needs 2 parameters');
  }

  if (!noSchema && type === TYPE_JSON) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
}

function extractPath(path) {
  var parsed;
  var reClose = new RegExp(/(?:%7D)/g);
  var reOpen = new RegExp(/(?:%7B)/g);

  if (arguments.length < 2) {
    throw new Error('Handlebars Helper \'extractPath\'' +
      ' needs 1 parameters');
  }

  if ((typeof path) !== 'string') {
    throw new TypeError('Handlebars Helper \'extractPath\'' +
      'requires path to be a string');
  }

  parsed = url.parse(path);
  parsed.path = parsed.path.replace(reClose, '}').replace(reOpen, '{');

  return parsed.path;
}

/**
 * split the long description into multiple lines
 * @param  {string} description  request description to be splitted
 * @returns {string}        multiple lines
 */
function length(description) {
  if (arguments.length < 2) {
    throw new Error('Handlebar Helper \'length\'' +
    ' needs 1 parameter');
  }

  if ((typeof description) !== 'string') {
    throw new TypeError('Handlebars Helper \'length\'' +
      'requires path to be a string');
  }
  return strObj(description).truncate(len - 50).s;
}

/**
 * replaces path params with obvious indicator for filling values
 * (i.e. if any part of the path is surrounded in curly braces {})
 * @param  {string} path  request path to be pathified
 * @param  {object} pathParams contains path parameters to replace with
 * @param  {object} [deps] specified dependencies for this API call
 * @returns {string}          pathified string
 */
function pathify(path, pathParams, deps) {
  var r;
  var re = new RegExp(/(?:\{+)(.*?(?=\}))(?:\}+)/g);
  var re2;
  var matches = [];
  var match;
  var m = re.exec(path);
  var i;

  if (arguments.length < 3) {
    throw new Error('Handlebars Helper \'pathify\'' +
      ' needs at least 2 parameters');
  }

  if ((typeof path) !== 'string') {
    throw new TypeError('Handlebars Helper \'pathify\'' +
      'requires path to be a string');
  }

  if ((typeof pathParams) !== 'object') {
    throw new TypeError('Handlebars Helper \'pathify\'' +
      'requires pathParams to be an object');
  }

  function depsReplace(key) {
    if (_.includes(deps[key], match)) {
      path = path.replace(re2, '\' + deps.' +
        key + '.' + match + ' + \'');

      return path;
    } else {
      path = path.replace(re2, '{' + match + ' PARAM GOES HERE}');
    }
  }

  if (Object.keys(pathParams).length > 0 || deps !== undefined) {
    while (m) {
      matches.push(m[1]);
      m = re.exec(path);
    }

    for (i = 0; i < matches.length; i++) {
      match = matches[i];

      re2 = new RegExp('(\\{+)' + match + '(?=\\})(\\}+)');

      if (typeof (pathParams[match]) !== 'undefined' &&
          pathParams[match] !== null) {
        // console.log("Match found for "+match+": "+pathParams[match]);
        path = path.replace(re2, pathParams[match]);
      } else if (deps !== undefined) {
        Object.keys(deps).forEach(depsReplace);
      } else {
        // console.log("No match found for "+match+": "+pathParams[match]);
        path = path.replace(re2, '{' + match + ' PARAM GOES HERE}');
      }
    }
    return '\'' + path + '\'';
  }

  r = new RegExp(/(?:\{+)(.*?(?=\}))(?:\}+)/g);
  return '\'' + path.replace(r, '{$1 PARAM GOES HERE}') + '\'';
}

/**
 * replaces query string params with an obvious indicator or given value
 * @param {string} path request path to be querified
 * @param {string} paramName name of the query param to be querifed
 * @param {Object} queryVals given query param values
 * @param  {object} [deps] specified dependencies for this API call
 * @returns {Object} value of query string parameters or obvious indicators
 */
function querify(path, paramName, queryVals, deps) {
  var parsed;

  if (arguments.length < 4) {
    throw new Error('Handlebar Helper \'querify\'' +
    ' needs at least 3 parameters');
  }

  parsed = url.parse(path);
  if (queryVals[parsed.path]) {
    if (queryVals[parsed.path][paramName]) {
      if ((typeof queryVals[parsed.path][paramName]) === 'string') {
        return '\'' + queryVals[parsed.path][paramName] + '\'';
      } else {
        return queryVals[parsed.path][paramName];
      }
    }
  } else if (deps) {
    for (var key in deps) {
      if (_.includes(deps[key], paramName)) {
        return 'deps.' + key + '.' + paramName;
      }
    }
  }

  return '\'DATA GOES HERE\'';
}

/**
 * replaces body parameters with an obvious indicator or given values
 * @param {string} path request path to be bodified
 * @param {string} paramName name of the body param to be bodified
 * @param {Object} bodyVals given body param values
 * @param  {object} [deps] specified dependencies for this API call
 * @returns {Object} value of body parameter or obvious indicator
 */
function bodify(path, paramName, bodyVals, deps) {
  var parsed;

  if (arguments.length < 4) {
    throw new Error('Handlebar Helper \'bodify\'' +
    ' needs at least 3 parameters');
  }

  parsed = url.parse(path);
  parsed.path = parsed.path.replace('%7D', '}').replace('%7B', '{');

  if (bodyVals[parsed.path]) {
    if (bodyVals[parsed.path][paramName]) {
      if ((typeof bodyVals[parsed.path][paramName]) === 'string') {
        return '\'' + bodyVals[parsed.path][paramName] + '\'';
      } else if ((typeof bodyVals[parsed.path][paramName]) === 'object') {
        return '{\n' +
          prettyPrintJson(bodyVals[parsed.path][paramName], '            ')
          + '\n          }';
      } else {
        return bodyVals[parsed.path][paramName];
      }
    }
  } else if (deps) {
    for (var key in deps) {
      if (_.includes(deps[key], paramName)) {
        return 'deps.' + key + '.' + paramName;
      }
    }
  }

  return '\'DATA GOES HERE\'';
}

// http://goo.gl/7DbFS
function prettyPrintJson(obj, indent) {
  var result = '';

  if (indent == null) indent = '';

  for (var property in obj) {
    if (property.charAt(0) !== '_') {
      var value = obj[property];

      if (typeof value === 'string') {
        value = '\'' + value + '\'';
      } else if (typeof value === 'object') {
        if (value instanceof Array) {
          value = '[ ' + value + ' ]';
        } else {
          // Recursive dump
          var od = prettyPrintJson(value, indent + '  ');

          value = '{\n' + od + '\n' + indent + '}';
        }
      }
      result += indent + property + ': ' + value + ',\n';
    }
  }
  return result.replace(/,\n$/, '');
}
