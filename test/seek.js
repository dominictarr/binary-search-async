
var tape = require('tape')
var search = require('../')
var seek = require('../seek')
var a = [], mid = null

var k = 0
function get (i, cb) {
  k++
  return cb(null, a[i])
}

function compare(a, b) {
  return a - b
}

var N = 100
for(var i = 0; i < N; i++)
  a.push(Math.random())
a.sort(compare)

function cb (err, _mid, value) {
  mid = _mid
  if(err) throw err
  return mid
}

function assertExact(t, r, i, a) {
  t.ok(i >= 0, 'finds exact result')
  t.ok(
    a.slice(0, i).every(function (e) { return e < r }),
    'indexes below i='+i+' are less than r='+r
  )
  t.ok(
    a.slice(i+1).every(function (e) { return e > r }),
    'indexes greater than i='+i+' are greater than r='+r
  )
  t.equal(a[i], r)
}


function assertRange(t, r, i, a) {
  t.ok(i < 0, 'finds value before')
  t.ok(
    a.slice(0, ~i).every(function (e) { return e < r }),
    'indexes below i='+~i+' are less than r='+r
  )
  t.ok(
    a.slice(~i+1).every(function (e) { return e > r }),
    'indexes greater or equal than ~i='+~i+' are greater than r='+r
  )
  t.notEqual(a[i], r)
}

tape(N+' random numbers', function (t) {
//  return t.end()
  var r = Math.random() > 0.5 ? a[~~(Math.random()*a.length)] : Math.random()
  for(var j = 0; j < N; j++) {
    var ri = ~~(Math.random()*a.length)
    var r = a[ri]
    var i = search(get, r, compare, 0, a.length-1, cb)
    t.equal(a[i], r)
    assertExact(t, r, i, a)
    if(i < a.length - 1) {
      for(var k = i+1; k < a.length-1; k++) {
        var r2 = a[k]
        var i2 = seek(get, r2, compare, i, 0, a.length-1, cb)
        t.ok(i2 > i, 'seeked value should be greater')
        t.ok(a[i2] > r2, 'seek value is greater than')
        t.ok(i2 > i ,'seek index is creater than')
      }
    }
  }

  t.end()
})
return
tape('iterate', function (t) {
  var N = 10, a = []
  for(var i = 0; i < N; i++)
    a.push(Math.random())
  a.sort(compare)

  console.error('steps, distance, seek, search, efficiency.seeks,efficiency.search')
  for(var d = 1; d < N/2; d++) {
    var i = search(get, a[0], compare, 0, a.length-1, cb)
    if(i != 0) throw new Error('not equal')
    k = 0
    var n = 0
    for(var j = d; j < a.length-d; j+=d) {
      n++
      i = seek(get, a[j], compare, i, 0, a.length-1, cb)
      if(i != j+1) throw new Error('not equal')
    }
    var _k = k
    i = 0
    for(var j = d; j < a.length; j+=d) {
      i = search(get, a[j], compare, 0, a.length-1, cb)
      if(i != j) throw new Error('not equal')
    }
    console.error([n, d, _k, k, _k/(N-1), k/(N-1)].join(', '))
  }

  t.end()
})

