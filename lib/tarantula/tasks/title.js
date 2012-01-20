module.exports = function (response, window) {
  var title = window.document.querySelector('title');
  
  return (title) ? title.textContent : '';
};
