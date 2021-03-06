// Generated by CoffeeScript 1.10.0
var KissCookie, Promise, _, debug, fs, path;

Promise = require('bluebird');

fs = Promise.promisifyAll(require('fs'));

path = require('path');

debug = require('debug')('cookies');

_ = require('lodash');

KissCookie = (function() {
  var DEFAULT_OPTIONS;

  DEFAULT_OPTIONS = {
    directory: 'data',
    cookie_filename: 'cloudflare.cookie'
  };

  function KissCookie(options) {
    this.options = _.merge(DEFAULT_OPTIONS, options);
    this.options.directory = path.join(__dirname, '..', this.options.directory);
    this.options.cookie_path = path.join(this.options.directory, this.options.cookie_filename);
  }

  KissCookie.prototype.saveCookie = function(cookie_string) {
    if (!fs.existsSync(this.options.directory)) {
      fs.mkdirSync(this.options.directory);
    }
    return fs.writeFileSync(this.options.cookie_path, cookie_string);
  };

  KissCookie.prototype.loadCookie = function() {
    if (fs.existsSync(this.options.cookie_path)) {
      return fs.readFileSync(this.options.cookie_path).toString().trim();
    } else {
      return '';
    }
  };

  return KissCookie;

})();

module.exports = KissCookie;
