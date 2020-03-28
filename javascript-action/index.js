const core = require('@actions/core');
const wait = require('./wait');


// most @actions toolkit packages have async methods
async function run() {
  try {

    core.error('hello%0world');
    core.error('foo\nbar');
    core.setFailed('this action always fails\nbecause%0Aof reasons')
  } 
  catch (error) {
    core.setFailed(error.message);
  }
}

run()
