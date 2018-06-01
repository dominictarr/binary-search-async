binary-search
=============


adapted from [darkskyapp's binary-search](https://github.com/darkskyapp/binary-search)

## example

``` js

var search = require('binary-search-async')

search(function get (i, cb) {
  asyncLookup(i, cb)
}, target, compare, lo, hi, cb)

```

All arguments are mandatory. this assumes you are using integer
indexes.

note: `hi` is the highest index, not the length! highest index is length - 1!

License
-------

To the extent possible by law, The Dark Sky Company, LLC has [waived all
copyright and related or neighboring rights][cc0] to this library.

[cc0]: http://creativecommons.org/publicdomain/zero/1.0/

