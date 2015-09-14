'use strict';

var express = require('express'),
    request = require('superagent'),
    app     = express(),
    config  = require('./config'),
    url     = require('url');

app.get('*', function(req, res){
  var reqUrl = url.parse(req.url).pathname;
  var queryString = url.parse(req.url).search;

  if (reqUrl === '/forum' || reqUrl === '/forum/') {
    res.redirect('http://www.redhat.com/en/about/events?f[0]=field_event_type%3A8101&rset1_format=list');
    return;
  }

  if (reqUrl === '/forum/tokyo' || reqUrl === '/forum/tokyo/') {
    res.redirect('https://redhatforum.jp/' + (queryString ? queryString : ''));
    return;
  }

  if (reqUrl === '/' || !reqUrl) {
    res.redirect('http://redhat.com/events');
    return;
  }

  var reqBase = '/' + reqUrl.split('/').slice(0, 3).filter(function (elem) {
    return !!elem
  }).join('/');

  if (reqBase === reqUrl) {
    res.redirect(reqBase + '/' + (queryString ? queryString : ''))
    return;
  }

  var resource = reqUrl.split('/').slice(3).join('/');
  var endFull  = config[reqBase];

  if (endFull === undefined) {
    res.redirect('/forum');
    return;
  }

  var endBase  = (function () {
    var parts = endFull.split('/')
    return parts.slice(0, parts.length - 1).join('/')
  })();

  var resourceUrl;
  if (resource) {
    resourceUrl = [endBase, resource].join('/')
  } else {
    resourceUrl = endFull
  }

  var accept = req.headers.accept
  var contentType = accept && accept.split(',')[0].trim()
  if (contentType) {
    res.setHeader('content-type', contentType)
  }

  request
    .get(resourceUrl)
    .pipe(res);
});

app.listen(8000);

