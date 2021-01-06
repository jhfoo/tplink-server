const restify = require('restify'),
  server = restify.createServer(),
  TpLinkClient = require('tplink-smarthome-api'),
  CONFIG = {
    PORT: 8080,
    DEVICE: {
      DEF_PORT: 9999,
      TIMEOUT: 2000
    },
    DEVERR_PING: 100
  }

let devices = {
  '192.168.88.118': null,
  '192.168.88.138': null,
  '192.168.88.139': null,
  '192.168.88.149': null,
  },
  isAutoScan = true

function respond(req, res, next) {
  const client = new TpLinkClient.Client(),
    device = client.getDevice({
      host: req.params.host
    }, {
      timeout: CONFIG.DEVICE.TIMEOUT
    })
    .then((dev) => {
      dev.getSysInfo().then((info) => {
        console.log(info)
        res.setHeader('content-type', 'text/plain')
        res.send(JSON.stringify(info, null, 2))
      })
    })
    .catch((err) => {
      console.log('Error caught')
      console.log(err)
      res.send(500, err.message)
    })
    .finally(() => {
      next()
    })
}

function scanHost(host) {
  const client = new TpLinkClient.Client()

  console.log(`Scanning ${host}`)
  return client.getDevice({
    host: host
  }, {
    timeout: CONFIG.DEVICE.TIMEOUT
  })
  .then((dev) => {
    dev.getSysInfo().then((info) => {
      devices[host] = info
      console.log(info)
    })
  })
  .catch((err) => {
    console.log('Error caught')
    if (!devices[host] || devices[host].err_code !== CONFIG.DEVERR_PING) {
      devices[host] = {
        err_code: CONFIG.DEVERR_PING,
        err_since: new Date()
      }
    }
    console.log(err)
  })
  .finally(() => {
    devices[host].LastScan = new Date()
  }
}

function scanHosts() {
  let promises = []
  Object.keys(devices).forEach((host) => {
    promises.push(scanHost(host))
  })

  Promise.all(promises).then(() => {
    console.log('Hosts scanned')
    setTimeout(() => {
      scanHosts()
    }, 3 * 1000)
  })
}

server.get('/info/:host', respond)
server.get('/*', restify.plugins.serveStatic({
  directory: './public',
  default: 'index.html'
}))

server.listen(CONFIG.PORT, function() {
  console.log('%s listening at %s', server.name, server.url)
})

if (isAutoScan) {
  scanHosts()
}