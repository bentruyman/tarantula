module.exports = function (level, window) {
  var doc = window.document,
      headings;
  
  headings = Array.prototype.slice.call(doc.querySelectorAll(level));
  
  headings = headings.map(function (heading) {
    return heading.textContent;
  });
  
  return headings;
};
