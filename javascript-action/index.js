const core = require('@actions/core');
const create_annotations_for_results = require('./xml_annotate');


// most @actions toolkit packages have async methods
async function run() {
  try {
    create_annotations_for_results(core.getInput('xunit_path'));
  } 
  catch (error) {
    core.setFailed(error.message);
  }
}

run()
