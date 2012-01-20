module.exports = function (response, window) {
  var keywords = window.document.querySelector('meta[name="keywords"]');
  
  return (keywords) ? keywords.content : '';
};
