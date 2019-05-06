// Async pattern callback:

import { URI } from '../types'
/**
 * Async pattern: "callback hell":
 * 2 evils of callback hell:
 * - INVERSION OF CONTROL
 *  (
 *    in the ctx of cb as:
 *    There's part of my program that I'm in control of executing.
 *    And then, there's another portion of my code that I'm not in control of executing.
 *  )
 *  And the way that we express that is to take the first half of my program that executes now and
 *  the second half of my code that executes in the callback, and when I give that call back to
 *  somebody else. That's what inverts the control and it puts them in control of when and in what
 *  manner to execute the second half of my program.
 *  You did not realize that there was a trust point when you passed in a callback.
 *  When you passed in a callback you are trusting that that callback will be not called too many
 *  times or too few times or whatever.
 *  This is a fundamental deficiency in callback design is that the callback itself does not have a
 *  solution, there is no solution for this part of callback hell, this inversion of control trust
 *  issue.
 *
 *    TRUST:
 *      1. not too early
 *      2. not too late
 *      3. not too many times
 *      4. not too few times
 *      5. no lost context
 *      6. no swallowed errors
 *
 * - callbacks are not REASONable:
 *  they are not able to be reasoned about...
 */

// pyramid of doom:
setTimeout(() => {
  console.log('one')
  setTimeout(() => {
    console.log('two')
    setTimeout(() => {
      console.log('three')
    }, 1000)
  }, 1000)
}, 1000)

// still callback hell even if handled like this
function one(cb: () => void): void {
  console.log('one')
  setTimeout(cb, 1000)
}

function two(cb: () => void): void {
  console.log('two')
  setTimeout(cb, 1000)
}

function three(): void {
  console.log('three')
}

one(function() {
  two(three)
})

// EXERCISE *************************************

function fakeAjax(url: URI, cb: (text: string) => any) {
  const fake_responses = {
    file1: 'The first text',
    file2: 'The middle text',
    file3: 'The last text',
  }
  const randomDelay = (Math.round(Math.random() * 1e4) % 8000) + 1000

  console.log('Requesting: ' + url)

  setTimeout(function() {
    cb(fake_responses[url])
  }, randomDelay)
}

function output(text: string): void {
  console.log(text)
}

// **************************************
// The old-n-busted callback way

function getFile(file: URI) {
  fakeAjax(file, function(text) {
    // what do we do here?
    fileReceived(file, text)
  })
}

// hold responses in whatever order they come back
const responses: {
  file1?: string | true
  file2?: string | true
  file3?: string | true
} = {}

function fileReceived(file: URI, text: string) {
  // haven't received this text yet?
  if (!(file in responses)) {
    responses[file] = text
  }

  const files: ['file1', 'file2', 'file3'] = ['file1', 'file2', 'file3']

  // loop through responses in order for rendering

  for (const _file of files) {
    // response received?

    if (_file in responses) {
      if (responses[_file] !== true) {
        // response needs to be rendered?
        output(responses[_file])
        responses[_file] = true
      }
      // can't render yet
    } else {
      // not complete!
      return false
    }
  }
  output('Complete!')
}

// request all files at once in "parallel"
getFile('file1') //?
getFile('file2') //?
getFile('file3') //?
