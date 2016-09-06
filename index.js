var cmify = require('cmify')
var fs = require('fs')
var path = require('path')

var css

// has to happen after all require so place at end of tick
function styles (cb) {
  setImmediate(function () {
    if (css) return cb(null, css)
    css = cmify.getAllCss()
    cb && cb(null, css)
  })
}

module.exports = function (file) {
  file = file || './styles.css'
  file = path.resolve(path.dirname(caller()), file)
  return cmify(fs.readFileSync(file, 'utf8'), file)
}

module.exports.styles = styles

function caller () {
  var frame
  var file
  var pst = Error.prepareStackTrace

  Error.prepareStackTrace = function (_, stack) {
    Error.prepareStackTrace = pst
    return stack.slice(2)
  }

  var stack = new Error().stack

  do {
      frame = stack.shift()
      file = frame && frame.getFileName()
  } while (stack.length && file === 'module.js')

  return file
}