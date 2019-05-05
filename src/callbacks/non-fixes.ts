/**
 * Kyle: There's a bunch of Non Fixes that have been attempted with callbacks.
 * I call them Non Fixes cuz they're attempts at fixing which actually did nothing but make it
 * worse.
 *
 * - separate callbacks:
 *  So for example, in the callback world we invented this pattern of split callbacks. If our
 *  problem that we're trying to solve is that we've got an error that we don't wanna get swallowed
 *  in case there's some problem with the main function, we're like I know I'll just pass a separate
 *  callback for my errors.
 *
 * - "error-first style":
 *  In the node world, we invented what often times referred to as node style, I like to call error
 *  first callbacks.
 */

// separate callbacks
function trySomething2(
  ok: (num: number) => any,
  err: (num: number) => any
): void {
  setTimeout(function() {
    const num = Math.random()
    if (num > 0.5) ok(num)
    else err(num)
  }, 1000)
}

trySomething2(
  function(num) {
    console.log('Success: ' + num)
  },
  function(num) {
    console.log('Sorry: ' + num)
  }
)

// "error-first style":

function trySomething1(cb: (err: null | string, num?: number) => any): void {
  setTimeout(function() {
    const num = Math.random()
    if (num > 0.5) cb(null, num)
    else cb('Too low!')
  }, 1000)
}

trySomething1(function(err, num) {
  if (err) {
    console.log(err)
  } else {
    console.log('Number: ' + num)
  }
})
