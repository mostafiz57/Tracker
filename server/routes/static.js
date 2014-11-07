var express = require('express');
var favicon = require('serve-favicon');

module.exports = function (app, serverConfig) {
	app.use(favicon(serverConfig.distFolder + '/favicon.ico'));

  // First looks for a static file: index.html, css, images, etc.
  app.use(serverConfig.staticUrl, express.static(serverConfig.distFolder));
  app.use(serverConfig.staticUrl, function(req, res, next) {
    res.status(404).end(); // If we get here then the request for a static file is invalid
  });
};