import { makeThunk } from './index'

const get10 = makeThunk(getData, 10)
const get30 = makeThunk(getData, 30)

function getData(d: number | string, cb: (data: number | string) => any) {
  setTimeout(function() {
    cb(d)
  }, 1000)
}

get10(function(num1) {
  const x = 1 + ((num1 as unknown) as number)

  get30(function(num2) {
    const y = 1 + ((num2 as unknown) as number)

    const getAnswer = makeThunk(getData, 'Meaning of life: ' + (x + y))

    getAnswer(function(answer) {
      console.log(answer)
    })
  })
})

/**
 * There's something really important to note here...
 * This is what I would call a lazy thunk.
 * It doesn't do the work until you call it the first time.
 */
