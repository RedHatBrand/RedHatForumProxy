'use strict';

var express = require('express'),
    request = require('superagent'),
    app     = express(),
    config  = require('./config');

app.get('*', function(req, res){
  if (req.url === '/' || !req.url) {
    res.redirect('http://redhat.com/events');
    return;
  }

  if (req.url === '/forum' || req.url === '/forum/') {
    res.redirect('http://www.redhat.com/en/about/events?f[0]=field_event_type%3A8101&rset1_format=list');
    return;
  }

  var reqBase  = req.url.split('/').slice(0, 3).join('/');

  if (reqBase === req.url) {
    res.redirect(reqBase + '/')
    return;
  }

  var resource = req.url.split('/').slice(3).join('/');
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

