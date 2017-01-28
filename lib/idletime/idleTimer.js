var macOsIdleTimer   = require('./macOsIdleTimer');
var os               = require('os');
var windowsIdleTimer = require('./windowsIdleTimer');

var idleTimerImpl;
switch(os.platform()){
    case "win32":
        idleTimerImpl = windowsIdleTimer;
        break;
    case "darwin":
        idleTimerImpl = macOsIdleTimer;
        break;
    default:
        throw new Error("Unsupported platform "+os.platform()+", this program is unable to figure out how long is has been since you touched the keyboard or mouse using your operating system.");
}

module.exports = idleTimerImpl;