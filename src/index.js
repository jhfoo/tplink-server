const restify = require('restify'),
  server = restify.createServer(),
  TpLinkClient = require('tplink-smarthome-api'),
  corsMiddleware = require('restify-cors-middleware'),
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
  '192.168.88.200': null,
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

  // console.log(`Scanning ${host}`)
  return client.getDevice({
    host: host
  }, {
    timeout: CONFIG.DEVICE.TIMEOUT
  })
  .then((dev) => {
    dev.getSysInfo().then((info) => {
      devices[host] = info
      devices[host].LastScan = new Date()
      // console.log(info)
    })
  })
  .catch((err) => {
    console.log('Error caught')
    if (!devices[host] || devices[host].err_code !== CONFIG.DEVERR_PING) {
      devices[host] = {
        err_code: CONFIG.DEVERR_PING,
        err_since: new Date(),
        LastScan: new Date()
      }
    }
    console.log(err)
  })
}

function scanHosts() {
  let promises = []
  Object.keys(devices).forEach((host) => {
    promises.push(scanHost(host))
  })

  Promise.all(promises).then(() => {
    // console.log('Hosts scanned')
    setTimeout(() => {
      scanHosts()
    }, 3 * 1000)
  })
}

function SetDeviceRelay(req, res, next) {
  console.log(`${req.params.host}.setPowerState(${req.params.NewState})`)
  const client = new TpLinkClient.Client(),
    device = client.getDevice({
      host: req.params.host
    }, {
      timeout: CONFIG.DEVICE.TIMEOUT
    })
    .then((dev) => {
      let NewState = req.params.NewState === 'on' ? true : false
      dev.setPowerState(NewState).then((info) => {
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

function deviceList(req, res, next) {
  if (req.query.type === 'json') {
    res.send(devices)
  } else {
    res.setHeader('content-type', 'text/plain')
    res.send(JSON.stringify(devices, null, 2))
  }
  next()
}

const cors = corsMiddleware({
  origins: ['*'],
})

server.pre(cors.preflight)
server.use(cors.actual)
server.use(restify.plugins.queryParser({ 
  mapParams: false 
}))

server.get('/www/*', restify.plugins.serveStatic({
  directory: './public',
  default: 'index.html'
}))
server.get('/api/device/list', deviceList)
server.get('/api/device/info/:host', respond)
server.get('/api/device/:host/relay/:NewState', SetDeviceRelay)

server.listen(CONFIG.PORT, function() {
  console.log('%s listening at %s', server.name, server.url)
})

if (isAutoScan) {
  scanHosts()
}