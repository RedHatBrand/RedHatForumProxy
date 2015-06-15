'use strict';

var express = require('express'),
    request = require('superagent'),
    app     = express(),
    config  = require('./config');

app.get('*', function(req, res){
  var endpoint = config[req.url];

  if (req.url === '/') {
    res.redirect('http://redhat.com/events');
    return;
  }

  if (req.url === '/forum') {
    res.redirect('http://www.redhat.com/en/about/events?f[0]=field_event_type%3A8101&rset1_format=list');
    return;
  }

  if (endpoint === undefined) {
    res.redirect('/forum');
    return;
  }

  res.writeHead(200, { 'Content-Type' : 'text/html' });

  request
    .get(endpoint)
    .pipe(res);
});

app.listen(8000);

