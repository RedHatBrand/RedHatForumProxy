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

