module.exports = function (response, window) {
  var description = window.document.querySelector('meta[name="description"]'); 
  
  return (description) ? description.content : '';
};
