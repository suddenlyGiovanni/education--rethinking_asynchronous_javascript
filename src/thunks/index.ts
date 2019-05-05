// Async Patterns: Thunks

/**
 *
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

/**
 * the value of `thunkSync` itself (which is a function), it has become a container around that
 * particular collection of state.
 * And that is now a container that I can pass around anywhere in my program, as a container
 * wrapped around that state. And any time I want to extract it, I simply have to call that
 * function and I get the value out.
 * So it becomes like a token that represents this value and it's easy to get it out. All I have to
 * do is execute it to get the value out.
 */

// Asynchronous thunk

/**
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

/**
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
