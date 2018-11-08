//var search = require('./')

//after doing one binary search, do another one for a result
//greater than the first extra cheaply.

function search (get, target, compare, low, high, cb) {
  var mid = low + (high - low >> 1)
  return get(mid, function (err, value) {
    if(low >= high)
      return cb(null, low, value)

    if(compare(value, target) <= 0)
      return search(get, target, compare, mid+1, high, cb)
    else
      //don't decrease high, because we always want the value above.
      return search(get, target, compare, low, mid, cb)

  })
}

module.exports = function seek (get, target, compare, middle, low, high, cb) {
  if(middle === high) return cb(null, high+1)
  var prev_lo = low, prev_hi = high
  var lo = low, hi = high
  while(lo <= hi) {
    var search_mid = lo + (hi - lo >> 1)
    if(hi > middle) prev_hi = hi
    if(lo < middle) prev_lo = lo
    if(middle < search_mid) hi = search_mid - 1
    else if(middle > search_mid) lo = search_mid + 1
    else break;
  }

  return get(prev_hi, function (err, value) {
    var c = compare(value, target)
    if(c <= 0) //go higher!
      return seek(get, target, compare, prev_hi, low, high, cb)
    else {
      //we know middle is too low, what would we have done, binary
      //searching, if we found our way to middle and decided it was too low?
      return search(get, target, compare, middle+1, prev_hi, cb)
    }
  })
}

