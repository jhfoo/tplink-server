const restify = require('restify'),
  server = restify.createServer(),
  TpLinkClient = require('tplink-smarthome-api'),
  CONFIG = {
    PORT: 8080
  }

function respond(req, res, next) {
  res.send('hello ' + req.params.name);
  next();
}

server.get('/info/:host', respond);

server.listen(CONFIG.PORT, function() {
  console.log('%s listening at %s', server.name, server.url)
})