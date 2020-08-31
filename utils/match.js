/*jslint regexp: true*/
'use strict';

var parseProto = Object.create(Function.prototype);

var log = function () {};

function match(_path, opts) {
  var path = _path;
  opts = opts || {};
  if (opts.end === undefined) { opts.end = true; }
  if (opts.strict === undefined) { opts.strict = false; }
  if (opts.sensitive === undefined) { opts.sensitive = false; }

  var names = [];
  //name = [^/?*()]+ or \w+   
  path = path.replace(/(\/)?:(\w+)(\(.*\))?(\?)?/g, function (_, prefix, name, exp, optional) {
    //console.log(arguments);
    names.push(name);

    exp = exp || '([^/]+)';
    //exp = '([^/]+)';

    if (optional) {
      if (prefix) {
        return '/?' + exp + '?';
      } else {
        return exp + '?';
      }
    } else {
      if (prefix) {
        return '/' + exp;
      } else {
        return exp;
      }
    }
  });

  var endWithSlash = (path.slice(-1) === '/');

  var regex;

  if (opts.end) {
    if (!opts.strict) {
      if (endWithSlash) {
        path = path.slice(0, path.length -1);
      }

      path = path + '/?';
    }

    if (opts.sensitive) regex = RegExp('^' + path + '$')
    else regex = RegExp('^' + path + '$', 'i'); 
  } else { // opts.end === false
    names.push('tail');

    if (!opts.strict) {
      //nostrict_noslash
      if (!endWithSlash)
        path = path + '($|/.*)';
      else //nostrict_slash
        path = path.slice(0, path.length-1) + '(?:$|/(.*))';
    } else {
      //strict_noslash
      if (!endWithSlash)
        path = path + '(?:$|(/.*))';
      else //strict_slash
        path = path + '($|.*)';
    }

    if (opts.sensitive) regex = RegExp('^' + path)
    else regex = RegExp('^' + path, 'i'); 
  }
  

  log(_path, regex);

  function parse(url) {
    url = url.split('?')[0]; // url without query
    var p = regex.exec(url);
    log('    exec', url, 'return', p);
    if(!p) return null;
    var ret = {};
    for(var i=0; i<names.length; i++) {
      var val = decodeURIComponent(p[i+1] || '');
      ret[names[i]] = val;
    }
    return ret;
  }

  parse.__proto__ = parseProto;
  parse.regex = regex;
  parse.path = path;
  parse.names = names;
  return parse;
}

module.exports = match;
  