var toad = require('./lib/toad');

toad.crawl('http://www.nissancommercialvehicles.com/', {
// toad.crawl('http://ssiyc.com', {
  tasks: [
    'url',
    // 'status_code',
    'internal',
    'h1', // 'h2', 'h3', 'h4', 'h5', 'h6',
    // 'meta_description', 'meta_keywords',
    'title'
  ]
}, function (page) {
  console.log(page.url, page.title);
});
