import * as core from '@actions/core'
import {wait} from './wait'

async function run(): Promise<void> {
  try {
    const cc: string = core.getInput('CC')
    const cxx: string = core.getInput('CXX')
    const cxxabi: string = core.getInput("CXXABI");
    const sanitizer: string = core.getInput('SANITIZER');
    const cmake_extra_args: string = core.getInput('CMAKE_ARGS';
    )
    core.debug(`Waiting ${ms} milliseconds ...`)

    core.debug(new Date().toTimeString())
    await wait(parseInt(ms, 10))
    core.debug(new Date().toTimeString())

    core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
