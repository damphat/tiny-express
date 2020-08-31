'use strict';

var contentType = require('content-type');

 // ./utils/setCharset
 //   √ should add/replace charset
 //   √ should remove charset
module.exports = function (type, charset) {
  type = contentType.parse(type);
  
  if(charset) {
    type.parameters.charset = charset;
  } else {
    delete type.parameters.charset;
  }

  return contentType.format(type);
};