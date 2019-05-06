// Async Pattern: "completion event"

import { URI } from '../types'

/*
 * # Instruction
 * 1. You'll do the same thing as the previous exercise(s), but now you should use promises.
 *
 * 2. Expected behavior:
 * 	- Request all 3 files at the same time (in "parallel").
 * 	- Render them ASAP (don't just blindly wait for all to finish loading)
 * 	- BUT, render them in proper (obvious) order: "file1", "file2", "file3".
 * 	- After all 3 are done, output "Complete!".
 */
function fakeAjax(url: URI, cb: (text: string) => any): void {
  var fake_responses = {
    file1: 'The first text',
    file2: 'The middle text',
    file3: 'The last text',
  }
  var randomDelay = (Math.round(Math.random() * 1e4) % 8000) + 1000

  console.log('Requesting: ' + url)

  setTimeout(function() {
    cb(fake_responses[url])
  }, randomDelay)
}

function output<T>(text: T): T {
  console.log(text)
  return text
}

// **************************************

function getFile(file: URI) {
  // what do we do here?
  return new Promise(function executor(resolve) {
    fakeAjax(file, function(text) {
      resolve(text)
    })
  })
}

// request all files at once in "parallel"
const p1 = getFile('file1')
const p2 = getFile('file2')
const p3 = getFile('file3')

p1.then(output)
  .then(() => p2)
  .then(output)
  .then(() => p3)
  .then(output)
  .then(() => 'Completed!')
