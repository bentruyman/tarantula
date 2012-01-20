var Job = require('./job');

module.exports = {
  crawl: function (baseUrl, options, handler) {
    var job = new Job(options, handler);
    job.crawl(baseUrl);
  }
};
