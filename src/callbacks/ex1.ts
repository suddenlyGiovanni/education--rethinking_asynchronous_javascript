type URI = 'file1' | 'file2' | 'file3'
interface Cb<T> {
  (t: T): any
}
function fakeAjax(url: URI, cb: Cb<string>) {
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

export function getFile(file: URI) {
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
