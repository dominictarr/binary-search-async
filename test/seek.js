
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

var N = 1000
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
  var r = Math.random() > 0.5 ? a[~~(Math.random()*a.length)] : Math.random()
  for(var j = 0; j < N; j++) {
    var r = a[~~(Math.random()*a.length)]
    var i = search(get, r, compare, 0, a.length-1, cb)
    assertExact(t, r, i, a)
    if(i < a.length - 1) {
      for(var j = i+1; j < a.length; j++) {
        var r2 = a[j]
        var i2 = seek(get, r2, compare, i, 0, a.length-1, cb)
        t.ok(i2 > i, 'seeked value should be greater')
        assertExact(t, r2, i2, a)
      }
    }
  }
  for(var j = 0; j < N; j++) {
    var r = Math.random()
    var r2 = r + ((1-r)*Math.random())
    var i = search(get, r, compare, 0, a.length-1, cb)
    assertRange(t, r, i, a)
    if(~i < a.length - 1) {
      var i2 = seek(get, r2, compare, ~i, 0, a.length-1, cb)
      t.ok(~i2 > i, 'seeked value should be greater')
      assertRange(t, r2, i2, a)
    }
  }
  t.end()
})

tape('iterate', function (t) {
    console.error('steps, distance, seek, search, efficiency.seeks,efficiency.search')
  for(var d = 1; d < N/2; d++) {
    var i = search(get, a[0], compare, 0, a.length-1, cb)
  //  t.equal(i, 0)
    k = 0
    var n = 0
    for(var j = d; j < a.length; j+=d) {
      n++
      i = seek(get, a[j], compare, i, 0, a.length-1, cb)
//      t.equal(i, j)
    }
    var _k = k
    i = 0
    for(var j = d; j < a.length; j+=d) {
      i = search(get, a[j], compare, 0, a.length-1, cb)
    //  t.equal(i, j)
    }
    console.error([n, d, _k, k, _k/(N-1), k/(N-1)].join(', '))
  }

  t.end()
})

