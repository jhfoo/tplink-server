const { spawn } = require('child_process'),
  gulp = require('gulp'),
  eslint = require('gulp-eslint')

let child = null

function lint() {
  return gulp.src(['src/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
}

function spawnDev() {
  child = spawn('npm', ['run', 'dev:dev'], {
    stdio: 'inherit'
  })
  registerChildEvents()
}

function registerChildEvents() {
  child.on('exit', (code) => {
    console.log(`Child process exited on code: ${code}`)
    spawnDev()
  })
}

function runDev(cb) {
  if (child) {
    // stop existing child process
    console.log('Stopping current child...')
    child.kill()
  } else {
    spawnDev()
  }

  cb()
}

function watch(cb) {
  gulp.watch('src/*.js', {
    ignoreInitial: false,
    queue: false,
  }, gulp.series(lint, runDev))
  // cb()
}

exports.dev = watch
exports.default = watch