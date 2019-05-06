function getData(d: number | string): Promise<string | number> {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      resolve(d)
    }, 1000)
  })
}

let x: number

getData(10)
  .then(function(num1) {
    x = 1 + (num1 as number)
    return getData(30)
  })
  .then(function(num2) {
    const y = 1 + (num2 as number)
    return getData('Meaning og life: ' + (x + y))
  })
  .then(function(answer) {
    console.log(answer)
    // Meaning of life: 42
  })
