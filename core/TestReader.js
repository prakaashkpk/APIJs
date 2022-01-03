const path = require('path');
const fs = require('fs');

const chalk = require('chalk');
const log4js = require('log4js');
const logger = log4js.getLogger(path.basename(__filename));
const logUpdate = require('log-update');
const Ora = require('ora');
const logSymbols = require('log-symbols');
const {MeasureTime} = require('./Utilities');

logger.level = 'info';

// module
const deps = require('./GlobalFns');

// custom logger
const log = console.log;
const error = chalk.red;
const warn = chalk.yellow;
const success = chalk.green;
const successBold = chalk.green.bold;
const spinner = new Ora();


function searchTestFolder() {
  if (!fs.existsSync('../test/')) {
    return false;
  }
  return true;
}

function getTestFiles() {
  let f = null;
  if (f = fs.readdirSync('../test/')) {
    return f.length == 0 ? null : f;
  }
}

function runTestFiles(f = []) {
  f.forEach((g) => {
    require(fs.realpathSync(`../test/${g}`));
  });
}

async function runTests() {
  logger.debug(`Total Suites`, global.SUITES.size);
  for (const csuite of global.SUITES) {
    const suite = csuite[1];
    console.log(`Suite: ${suite.name}`);

    if (suite.beforeAll) {
      await suite.beforeAll.apply();
    }
    for (const test of suite.tests) {
      if (suite.beforeEach) {
        await suite.beforeEach.apply();
      }
      // console.log(`  Test: ${test.name}`);
      logUpdate(`  ${spinner.frame()} Test: ${test.name}`);
      await runTest(test);
      if (test.success) {
        logUpdate(`  ${logSymbols.success} Test: ${test.name}`);
      } else {
        logUpdate(`  ${logSymbols.error} Test: ${test.name}`);
      }
      logUpdate.done();
      if (suite.afterEach) {
        await suite.afterEach.apply();
      }
    }
    if (suite.afterAll) {
      await suite.afterAll.apply();
    }
  }
  printResults();
}

async function runTest(test) {
  this.test = test;
  await test.fn.apply();
}

function printResults() {
  // logger.debug(`STATS: `, global.STATS);
  // Time:        ${global.STATS.startTime}
  console.log(`\n`+
      `Test Suites: ${global.STATS.suites - global.STATS.failedSuites} passed, ${global.STATS.suites} total \n`+
      `Tests:       ${global.STATS.tests - global.STATS.failedTests} passed, ${global.STATS.tests} total \n`+
      `Time:        ${global.STATS.time.measure()} \n`,
  );
}

function main(argument) {
  if (searchTestFolder()) {
    let files;
    if (files = getTestFiles()) {
      runTestFiles(files);
      runTests();
    } else {
      console.error('No test files found.');
    }
  } else {
    console.error(`'test/' folder doesn't exits`);
  }
}

main();
