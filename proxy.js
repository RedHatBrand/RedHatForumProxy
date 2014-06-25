'use strict';

var express = require('express'),
    request = require('superagent'),
    app     = express(),
    config  = require('./config');

app.get('*', function(req, res){
  var cloudfrontUrl = config[req.url];

  if (cloudfrontUrl === undefined) {
    res.redirect('/forum');
    return;
  }

  res.writeHead(200, { 'Content-Type' : 'text/html' });

  request
    .get(cloudfrontUrl)
    .pipe(res);
});

app.listen(8000);

