var URL = require('url'),
    _   = require('../../../node_modules/underscore');

module.exports = function (response, window) {
  var doc = window.document,
      requestHost = response.request.uri.host,
      requestProtocol = response.request.uri.protocol;
  
  // if no document body exists, return an empty result set
  if (!doc.body) {
    return [];
  }
  
  // workaround to remove the script's filename as the document's base url
  var baseElement = doc.createElement('base');
  baseElement.href = response.request.uri.href;
  doc.body.appendChild(baseElement);
  
  var anchors = doc.querySelectorAll('a');
  
  // convert to array
  anchors = Array.prototype.slice.call(anchors);
  
  // return the href value without a hash value
  var hrefs = anchors.map(function (a) {
    var url = URL.parse(a.href);
    
    delete url.hash;
    
    return URL.format(url);
  });
  
  // determine if the href is internal or external
  var internal = hrefs.filter(function (href) {
    var url = URL.parse(href);
    
    if ((!url.host || url.host === requestHost) && url.protocol !== 'javascript:' && url.href.indexOf('#') !== 0) {
      return true;
    } else {
      return false;
    }
  });
  
  // prepend internal links with the request host and protocol if it doesn't exist
  internal = internal.map(function (href) {
    var url = URL.parse(href);
    
    url.host = url.host || requestHost;
    url.protocol = url.protocol || requestProtocol;
    
    return URL.format(url);
  });
  
  // remove duplicate urls
  internal = _.uniq(internal);
  
  return internal;
};