
var Cloudup = require('cloudup-client');
var replace = require('async-replace');
var path = require('path');
var url = require('url');
var fs = require('fs');

function mapper(stream) {
  return function(file, cb) {
    var item = stream.item();
    item.on('end', function(a) {
      cb(null, item.direct_url);
    });
    item.file(file);
  };
}

function replacer(stream, baseDir) {
  var map = mapper(stream);

  return function(matcher, alt, href, title, offset, string, done) {
    if (url.parse(href).protocol) {
      setImmediate(function() { done(null, matcher); });
      return;
    }
    map(path.resolve(baseDir, href), function(err, url) {
      done(err, '![' + alt + '](' + url + (title ? ' "' + title + '"' : '') + ')');
    });
  };
}

module.exports = function(file, opts, cb) {

  fs.readFile(file, { encoding: 'utf8' }, function(err, doc) {
	if (err) {
	  console.error("Error: Cannot open file " + err.path);
	  return;
    }    
    var client = new Cloudup({
      user: opts.username,
      pass: opts.password
    });
    
    var baseDir = path.dirname(file);
    var stream = client.stream({ title: opts.title });
    var regexp = /!\[((?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*)\]\(\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*\)/gm;

    var out;

    replace(doc, regexp, replacer(stream, baseDir), function(err, replaced) {
      // ugly code...
      out = replaced;
    });

    if (stream._items.length === 0) {
      cb(null, doc);
      return;
    }

    try {
      stream.save(function(err) {
        if (err) {
          if (!stream.isNew()) {
            stream.remove(function(removeErr) {
              if (removeErr) {
                cb(new Error(err + ' ' + removeErr));
              } else {
                cb(err);
              }
            });
          } else {
            cb(err);
          }
          return;
        }
        cb(null, out);
      });
    } catch(err) {
      cb(err);
    }
  });
};
