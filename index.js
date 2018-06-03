module.exports = function(haystack_get, needle, comparator, low, high, cb) {
  if('function' !== typeof haystack_get)
    throw new TypeError('binary-search-async: get(i, cb) function must be provided')
  if('function' !== typeof comparator)
    throw new TypeError('binary-search-async: compare(a,b) function must be provided')
  var mid, cmp;

  if(low === undefined)
    low = 0;

  else {
    low = low|0;
    if(low < 0 || low > high)
      throw new RangeError("invalid lower bound:"+low+', high:'+high);
  }

  high = high|0;
  if(high == null)
    throw new RangeError("upper bound must be provided");

  if(low > high) return cb(new Error('not found'))
  return (function next () {
    /* Note that "(low + high) >>> 1" may overflow, and results in a typecast
     * to double (which gives the wrong results). */
    mid = low + (high - low >> 1);
    return haystack_get(mid, function (err, value) {
      if(err) return cb(err)
      cmp = +comparator(value, needle, mid); //I is passed here, to check in tests.
      /* Too low. */
      if(cmp < 0.0)
        low  = mid + 1;

      /* Too high. */
      else if(cmp > 0.0)
        high = mid - 1;

      /* Key found. */
      else
        return cb(null, mid, value);

      /* Key not found. */
      if(low <= high) return next()
      else return cb(null, ~low, value)
    })
  })()
}

