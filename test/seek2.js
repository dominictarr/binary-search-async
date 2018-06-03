var tape = require('tape')

var a = [ 1, 2, 3,4.5,6,7,8,9 ], k = 0

function get (i, cb) {
  k++
  return cb(null, a[i])
}

function compare(a, b) {
  return a - b
}

function cb(err, value) {
  if(err) throw err
  return value
}

var seek = require('../seek')
var search = require('..')
tape('simple', function (t) {
//  t.equal(~seek(get, 1, compare, 0, 0, a.length-1, cb), 1)
//  t.equal(~seek(get, 2.2, compare, 0, 0, a.length-1, cb), 2)
//  t.equal(seek(get, 2, compare, 0, 0, a.length-1, cb), 2)
//  t.equal(~seek(get, 4, compare, 0, 0, a.length-1, cb), 3)
//

  t.equal(seek(get, 1, compare, 0, 0, a.length-1, cb), 1)
  t.equal(seek(get, 2.2, compare, 0, 0, a.length-1, cb), 2)
  t.equal(seek(get, 2, compare, 0, 0, a.length-1, cb), 2, 'equal?')
  t.equal(seek(get, 4, compare, 0, 0, a.length-1, cb), 3)

  for(var i = 0; i < a.length; i++) {
    var _i = search(get, a[i], compare, 0, a.length-1, cb)
    t.equal(_i, i)
    if(i < a.length - 1) {
      var j = seek(get, a[i], compare, i, 0, a.length-1, cb)
      t.equal(j, i+1)
    }
    else {
      t.throws(function () {
        seek(get, a[i], compare, i, 0, a.length-1, cb)
      }, RangeError)
    }
  }
//  t.equal(~seek(get, 2.5, compare, 1, 0, a.length-1, cb), 2)
  t.end()
})

