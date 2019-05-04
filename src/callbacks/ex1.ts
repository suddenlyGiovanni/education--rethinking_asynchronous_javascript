type URI = 'file1' | 'file2' | 'file3'
interface Cb<T> {
  (t: T): any
}
function fakeAjax(url: URI, cb: Cb<string>) {
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

function output(text: string): void {
  console.log(text)
}

// **************************************
// The old-n-busted callback way

function getFile(file: URI) {
  fakeAjax(file, function(text) {
    // what do we do here?
    output(text) //?
  })
}

// request all files at once in "parallel"
getFile('file1') //?
getFile('file2') //?
getFile('file3') //?
