import { URI } from '../types'

/*
 * # Instructions
 *
 * 1. You'll do the same thing as the previous exercise(s), but now you should use map/reduce,
 *  promises, and an array of files.
 *
 * 2. Expected behavior:
 *  - Request all 3 files at the same time (in "parallel").
 *  - Render them ASAP (don't just blindly wait for all to finish loading)
 *  - BUT, render them in proper (obvious) order: "file1", "file2", "file3".
 *  - After all 3 are done, output "Complete!".
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
// The old-n-busted callback way

function getFile(file: URI): Promise<string> {
  return new Promise(function executor(resolve) {
    fakeAjax(file, resolve)
  })
}

// Request all files at once in
// "parallel" via `getFile(..)`.
//
// Render as each one finishes,
// but only once previous rendering
// is done.

// ???

const files: URI[] = ['file1', 'file2', 'file3']

files
  .map(getFile)
  .reduce(function combine(chain, pr) {
    return chain
      .then(function() {
        return pr
      })
      .then(output)
  }, Promise.resolve())
  .then(function() {
    output('Complete!')
  }) //?
