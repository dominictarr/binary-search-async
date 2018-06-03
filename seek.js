var search = require('./')

//after doing one binary search, do another one for a result
//greater than the first extra cheaply.

module.exports = function seek (get, target, compare, middle, low, high, cb) {
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
    var c = compare(target, value)
    if(c > 0) {//if value is still lower than target, kep looking.
      if(prev_hi === high) return cb(null, ~prev_hi, value)
      return seek(get, target, compare, prev_hi, low, high, cb)
    }
    else if(c < 0) {
      return search(get, target, compare, prev_lo, prev_hi, cb)
    }
    else if(c == 0) {
      return cb(null, prev_hi, value)
    }
    else
      throw new Error('should never happen:'+c) //probably NaN
  })
}

