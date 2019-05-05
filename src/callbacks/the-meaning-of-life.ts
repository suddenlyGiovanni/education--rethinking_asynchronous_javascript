function getData(d: number | string, cb: (data: number | string) => any) {
  setTimeout(() => {
    cb(d)
  }, 1000)
}

getData(10, function(num1) {
  const x = 1 + num1
  getData(30, function(num2) {
    const y = 1 + num2
    getData('Meaning of life: ' + (x + y), function(answer) {
      console.log(answer)
      // Meaning of life: 42
    })
  })
})
