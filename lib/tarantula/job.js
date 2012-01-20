// dependencies
var jsdom   = require('../../node_modules/jsdom'),
    Q       = require('../../node_modules/q'),
    request = require('../../node_modules/request'),
    URL     = require('url'),
    _       = require('../../node_modules/underscore');

var Job = function (options, handler, finish) {
  var self = this;
  
  self.options = options;
  self.handler = handler;
  self.finish  = finish;
  
  self.cache = {};
  
  // import job tasks
  self.tasks = {};
  self.options.tasks.forEach(function (task) {
    self.tasks[task] = require('./tasks/' + task);
  });
};

Job.prototype.crawl = function (url) {
  var self = this;
  
  // flag this url as currently being processed
  self.cache[url] = true;
  
  self.process(url).then(function (result) {
    if (self.cache[url] === true) {
      // cache the request result
      self.cache[url] = result;
      
      // check to see if there are any new internal links to crawl
      if (result.internal) {
        result.internal.forEach(function (link) {
          if (!self.cache[link]) {
            self.crawl(link);
          }
        });
      }
      // check to see if there are any new internal links to crawl
      if (result.external) {
        result.external.forEach(function (link) {
          if (!self.cache[link]) {
            self.crawl(link);
          }
        });
      }
      
      // call the page handler
      self.handler.call(null, result);
      
      // check to see if any more open requests exist
      var finished = true;
      for (var key in self.cache) {
        if (self.cache[key] === true) {
          finished = false;
          break;
        }
      }
      
      if (finished) {
        self.finish(self.cache);
      }
    }
  });
};

Job.prototype.process = function (url) {
  var deferred = Q.defer(),
      result   = {},
      self     = this;
  
  request({ url: url }, function (error, response, body) {
    if (!error) {
      if (!body) {
        result.error = 'No Body';
        deferred.resolve(result);
      } else {
        // create a virtual DOM
        jsdom.env({
          html: body,
          features: { 
            FetchExternalResources: ['script'],
            QuerySelector: true,
            ProcessExternalResources: true
          },
          done: function (errors, window) {
            // run all tasks
            self.options.tasks.forEach(function (task) {
              result[task] = self.tasks[task](response, window);
            });
            
            deferred.resolve(result);
          }
        });
      }
    } else {
      result.error = 'Unknown Error';
      deferred.resolve(result);
    }
  });
  
  return deferred.promise;
};

module.exports = Job;

