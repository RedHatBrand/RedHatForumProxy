'use strict';

var express = require('express'),
    request = require('superagent'),
    app     = express(),
    config  = require('./config'),
    url     = require('url');

app.get('*', function(req, res){
  var reqUrl = url.parse(req.url).pathname;
  var queryString = url.parse(req.url).search;

  if (reqUrl === '/' || !reqUrl) {
    res.redirect('http://redhat.com/events');
    return;
  }

  if (reqUrl === '/forum' || reqUrl === '/forum/') {
    res.redirect('http://www.redhat.com/en/about/events?f[0]=field_event_type%3A8101&rset1_format=list');
    return;
  }

  var reqBase  = reqUrl.split('/').slice(0, 3).join('/');

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

  request
    .get(resourceUrl)
    .pipe(res);
});

app.listen(8000);

