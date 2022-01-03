/*
  Contains Globals
*/

const path = require('path');
const axios = require('axios');
const log4js = require('log4js');
const logger = log4js.getLogger(path.basename(__filename));
const https = require('https');
const {MeasureTime} = require('./Utilities');

logger.level = 'info';

// holders
const SUITES = new Map();
// Reference - https://flaviocopes.com/jest/passing-tests.png
const STATS = {
  suites: 0,
  tests: 0,
  failedSuites: 0,
  failedTests: 0,
  time: new MeasureTime(),
};

const beforeEachs = [];
const afterEachs = [];
const afterAlls = [];
const beforeAlls = [];

function describe(name, fn) {
  logger.debug(`describe [${name}]`);

  if (typeof(fn) !== 'function') {
    throw new Error(`Suite(describe) needs an function as argument`);
  }
  if (!name) {
    throw new Error(`Invalid name '${name}' for Suite(describe)`);
  }
  if (SUITES.has(name)) {
    throw new Error(`Suite '${name}' already exits`);
  }

  // add detail to context
  this.describeDetail = {
    name: name,
    fn: fn,
    tests: [],
  };
  SUITES.set(name, describeDetail);
  STATS.suites++;
  fn.apply();
}

function beforeAll(fn) {
  logger.debug(`beforeAll `);
  this.describeDetail.beforeAll = fn;
  // fn.apply();
}
function afterAll(fn) {
  logger.debug(`afterAll `);
  this.describeDetail.afterAll = fn;
  // fn.apply();
}
function beforeEach(fn) {
  logger.debug(`beforeEach `);
  // fn.apply();
}
function afterEach(fn) {
  logger.debug(`afterEach `);
  // fn.apply();
}

function it(name, fn) {
  logger.debug(`it [${name}]`);

  const itDetail = {
    name: name,
    fn: fn,
  };
  this.itDetail = itDetail;

  // get describe obj
  const describeDetail = this['describeDetail'];
  const suite = SUITES.get(describeDetail.name);
  suite.tests.push(itDetail);
  STATS.tests++;
}

// HTTP API support
async function get(url, body) {
  return (await request(url, 'get', {}));
}

async function post(url, body) {
  return (await request(url, 'post', {}));
}

async function put(url, body) {
  return (await request(url, 'put', {}));
}

async function request(url, method, data = {}) {
  const options = {
    url: url,
    method: method,
    // baseURL: '', // TODO: from config file
    headers: '', // TODO: from Auth layer
    timeout: 30000, // TODO: Add to config file
    maxRedirects: 1,
    validateStatus: function(status) {
      return status <= 600; // default
    },
    httpsAgent: new https.Agent({keepAlive: true}),
  };

  if (method !== 'get') {
    options.data = data;
  }

  try {
    logger.debug(`request - url: ${url}`);
    const res = await axios.request(options);
    return res;
  } catch (e) {
    logger.error(`Error - ${e}`);
    console.trace();
  }
}

function expect(value) {
  // attach test to expect
  const test = this.test;
  logger.debug(`Expect: `, value, test);
  return {
    toBe: (expect) => {
      if (value !== expect) {
        test.success = false;
        STATS.failedTests++;
      } else {
        test.success = true;
      }
    },
  };
}

global.describe = describe;
global.beforeAll = beforeAll;
global.afterAll = afterAll;
global.beforeEach = beforeEach;
global.afterEach = afterEach;
global.it = it;
global.get = get;
global.post = post;
global.put = put;
global.expect = expect;
global.SUITES = SUITES;
global.STATS = STATS;
