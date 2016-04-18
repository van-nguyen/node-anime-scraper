var expect = require('expect.js')
var scraper = require('../lib/index.js')
var cloudscraper = require('cloudscraper')

var Anime = scraper.Anime
var AnimeUtils = scraper.AnimeUtils

var ANIME_NAME = 'Yoru no Yatterman'
var ANIME_NAME_MULTIPLE = 'Akame ga Kill!'
var ANIME_NAME_UNICODE = 'Space☆Dandy (Sub)'
var ANIME_URL = 'https://kissanime.to/Anime/Boku-dake-ga-Inai-Machi'

before('anime-scraper', function(done) {
  this.timeout(10000)
  cloudscraper.get('http://kissanime.com', function(err, body, resp) {
    var cookieString = resp.request.headers.cookie
    AnimeUtils.setSessionCookie(cookieString)
    done()
  })
})

// Once we have our CloudFlare stuff out of the way, continue with the test.
describe('anime-scraper', function() {
  describe('AnimeUtils.searchByName', function() {
    describe('with blank string', function() {
      this.timeout(10000)
      it('returns a large array', function(callback) {
        AnimeUtils.searchByName('')
          .then(function(results) {
            expect(results).to.be.an('array')
            expect(results.length).to.be.above(150)
            callback()
          })
          .catch(function(error) {
            callback(error)
          })
      })
    })

    describe('with anime name', function() {
      this.timeout(4000)
      it('returns an array with one object', function(callback) {
        AnimeUtils.searchByName(ANIME_NAME)
          .then(function(results) {
            expect(results).to.be.an('array')
            expect(results.length).to.be(1)
            callback()
          })
          .catch(function(error) {
            callback(error)
          })
      })
    })

    describe('with multiple results: ' + ANIME_NAME_MULTIPLE, function() {
      this.timeout(10000)
      it('returns an array with more than one object', function(callback) {
        AnimeUtils.searchByName(ANIME_NAME_MULTIPLE)
          .then(function (results) {
            expect(results).to.be.an('array')
            expect(results.length).to.be.greaterThan(1)
            callback()
          })
          .catch(function (error) {
            callback(error)
          })
      })
    })
  })

  describe('Anime.fromName', function() {
    describe('with basic anime name: ' + ANIME_NAME, function() {
      this.timeout(10000)
      it('should return an anime object', function(callback) {
        Anime.fromName(ANIME_NAME)
          .then(function(anime) {
            expect(anime).to.be.an(Anime)
            callback()
          })
          .catch(function(error){
            callback(error)
          })
      })

    })

    describe('with multiple results: ' + ANIME_NAME_MULTIPLE, function() {
      this.timeout(10000)
      it('should return an error with \'matches\' property', function(callback) {
        Anime.fromName(ANIME_NAME_MULTIPLE)
          .then(function(anime) {
            callback()
          })
          .catch(function(error){
            if (typeof error.matches !== 'undefined')
              callback()
            else
              callback(error)
          })
      })
    })

    describe('with unicode character: ' + ANIME_NAME_UNICODE, function() {
      this.timeout(10000)
      it('should return an anime object', function(callback) {
        Anime.fromName(ANIME_NAME_UNICODE)
          .then(function(anime) {
            expect(anime).to.be.an(Anime)
            callback()
          })
          .catch(function(error){
            callback(error)
          })
      })
    })
  })

  describe('Anime.fromUrl', function() {
    describe('with anime url: ' + ANIME_URL, function() {
      it('should return an anime object', function (callback) {
          Anime.fromUrl(ANIME_URL)
            .then(function (anime) {
              expect(anime).to.be.an(Anime)
              callback()
            })
            .catch(function (error) {
              callback(error)
            })
      })
    })
  })

  describe('Episode.getVideoUrl', function() {
    describe('retrieve video URLs', function() {
      this.timeout(10000)
      it('should return a list of video URLs', function(callback) {
        Anime.fromUrl(ANIME_URL)
          .then(function(anime) {
            expect(anime.episodes.length).to.be.above(0)
            anime.episodes[0].getVideoUrl().then(function (urls) {
              expect(urls.length).to.be.greaterThan(0)
              callback()
            })
          })
          .catch(function(error) {
            callback(error)
          })
      })
    })
  })
})