var Job = require('./job');

module.exports = {
  crawl: function (baseUrl, options, handler, finish) {
    var job = new Job(options, handler, finish);
    job.crawl(baseUrl);
  }
};
