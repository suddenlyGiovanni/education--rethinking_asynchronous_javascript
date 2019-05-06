// Async Patterns: Thunks
import { URI } from '../types'

/*
 * Thunks are a pattern on top of callbacks.
 * A Thunk is a function that has everything already that it needs to do to give you some value
 * back. You do not need to pass any arguments in, you simply call it and it will give you a value
 * back.
 *
 * A Thunk is just a function with some closure state keeping track of some value, or values, and
 * it gives you those things back whenever you call the function.
 */

function add(x: number, y: number): number {
  return x + y
}

const thunkSync = function() {
  return add(10, 15)
}

thunkSync() //?

/*
 * the value of `thunkSync` itself (which is a function), it has become a container around that
 * particular collection of state.
 * And that is now a container that I can pass around anywhere in my program, as a container
 * wrapped around that state. And any time I want to extract it, I simply have to call that
 * function and I get the value out.
 * So it becomes like a token that represents this value and it's easy to get it out. All I have to
 * do is execute it to get the value out.
 */

// Asynchronous thunk

/*
 * What is an asynchronous thunk?
 * Well, an asynchronous thunk is that it is a function that doesn't need any arguments passed to
 * it to do its job, except `you need to pass it a callback so that you can get the value out`.
 */

function addAsync(x: number, y: number, cb: (data: number) => any) {
  setTimeout(function() {
    cb(add(x, y))
  }, 1000)
}

const thunkAsync = function(cb: <T>(data: T) => any) {
  addAsync(10, 15, cb)
}

thunkAsync(function(data) {
  console.log(data) //?
})

/*
 * Here's what's incredibly powerful about this pattern.
 * From the outside world we do not know nor do we have to care whether that value is available
 * immediately or whether it's gonna take a while to get us that value.
 * So the first time we call func and we pass in a callback, it might have to do some significant
 * work to calculate the answer to your question.
 * And then it may decide to memorize the answer to that question, so the next time you call it,
 * it just gives you the value back right away.
 *
 *
 * What's happening here is that by wrapping this function around the state and allowing it to be
 * asynchronous in nature we have essentially `normalized time out of the equation` we have
 * factored time out of the equation.
 *
 * We have produced a wrapper around the value that has become time independent.
 * It doesn't matter if the value is there now or if it's gonna come later we still use it in the
 * exactly the same way.
 *
 * Time is the most complex Factor of state in your program.
 * Managing time is the most complex state in your program.
 * `That's why this is huge!`
 */

export function makeThunk(...arg: any[]) {
  const [fn, ...args] = arg
  return function(cb: <T>(data: T) => any) {
    args.push(cb)
    fn.apply(null, args)
  }
}

const madeThunk = makeThunk(addAsync, 10, 15)

madeThunk(function(data) {
  console.log(data) // 25
})

/*
# Instructions

1. You'll do the same thing as the previous exercise(s), but now you should use thunks.

2. Expected behavior:
   - Request all 3 files at the same time (in "parallel").
   - Render them ASAP (don't just blindly wait for all to finish loading)
   - BUT, render them in proper (obvious) order: "file1", "file2", "file3".
   - After all 3 are done, output "Complete!".
*/
function fakeAjax(url: URI, cb: (text: string) => any) {
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

function output<T>(data: T): T {
  console.log(data)
  return data
}

// **************************************

interface Thunk {
  (cb: <T>(data: T) => any): any
}
function getFileEagerly(file: URI): Thunk {
  // what do we do here?
  // we need to create an active thunk that call the fake api immediately
  let text: undefined | string
  let fn: (data: string) => any | undefined

  fakeAjax(file, function(response) {
    if (fn) fn(response)
    else text = response
  })

  return function(cb) {
    if (text) cb(text)
    else fn = cb
  }
}

function getFileLazily(file: URI): Thunk {
  return function(cb) {
    fakeAjax(file, cb)
  }
}

// request all files at once in "parallel"
const thL1 = getFileLazily('file1')
const thL2 = getFileLazily('file2')
const thL3 = getFileLazily('file3')

thL1(function(text1) {
  output(text1) //?

  thL2(function(text2) {
    output(text2) //?

    thL3(function(text3) {
      output(text3) //?
      output('Complete!') //?
    })
  })
})

// now let's do the same but with eagers thunks

const thE1 = getFileEagerly('file1')
const thE2 = getFileEagerly('file2')
const thE3 = getFileEagerly('file3')

thE1(function(text1) {
  output(text1) //?

  thE2(function(text2) {
    output(text2) //?

    thE3(function(text3) {
      output(text3) //?
      output('Complete!') //?
    })
  })
})
