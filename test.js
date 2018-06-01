var tape = require('tape')

  var bs  = require("./"),
      arr = [1, 2, 2, 2, 3, 5, 9],
      cmp = function(a, b) { return a - b; };

  var lo = 0, hi = arr.length

  function get (i, cb) {
    return cb(null, arr[i])
  }

  function cb (err, value) {
    if(err) throw err
    return value
  }

  tape("bail if not passed an array", function(t) {
    t.throws(function() { bs(undefined, 3, cmp, lo, hi, cb); })
    t.end()
  });

  tape("bail if not passed a comparator", function(t) {
    t.throws(function() { bs(get, 3, undefined, lo, hi, cb); })
    t.end()
  });

  tape("return the index of an item in a sorted array", function(t) {
    t.equal(bs(get, 3, cmp, lo, hi, cb), 4)
    t.end()
  });

  tape("return the index of where the item would go plus one, negated, if the item is not found", function(t) {
    t.equal(bs(get, 4, cmp, lo, hi, cb), -6);
    t.end()
  });

  tape("return any valid index if an item exists multiple times in the array", function(t) {
    t.equal(bs(get, 2, cmp, lo, hi, cb), 3);
    t.end()
  });

  tape("work even on empty lookups", function(t) {

    t.throws(function () {
      bs(function (_, cb) { return cb(new Error()) }, 42, cmp, lo, hi, cb)
    })
    t.end()
  });

  tape("work even on arrays of doubles", function(t) {
    var decimals = [0.0, 0.1, 0.2, 0.3, 0.4]
    t.equal(bs(function (i, cb) {
      return cb(null, decimals[i])
    }, 0.25, cmp, 0, 5, cb), -4);
    t.end()
  });

  tape("pass the index and array parameters to the comparator", function(t) {
    var indexes = [],
        indexCmp = function(a, b, i) {
          indexes.push(i);
          return cmp(a, b);
        };
    bs(get, 3, indexCmp, 0, arr.length, cb);
    t.deepEqual(indexes,[3, 5, 4])
    t.end()
  });



