var childProcess = require('child_process');
var Q            = require('q');
var xmldom       = require('xmldom');
var xpath        = require('xpath');

/*
 * I tried using ioreg@0.0.1, but that depends on the missing class Promise, which would require a Node.js upgrade
 */

var domParser = new xmldom.DOMParser();

/**
 * Tip of the hat to https://www.dssw.co.uk/blog/2015-01-21-inactivity-and-idle-time/
 * @return Promise for Number of milliseconds since the keyboard or mouse of the local workstation were used
 */
module.exports.getIdleTime = function(){
    return Q.nfcall(childProcess.execFile, "ioreg", ["-a", "-c", "IOHIDSystem"])
        .spread(function(stdout, stderr){
            stdout = require('fs').readFileSync("B:/iohidsystem.xml", { encoding: 'utf8' });
            var doc = domParser.parseFromString(stdout, "application/xml");
            var xpathQuery = "(//key[text()='HIDIdleTime'])[1]/following-sibling::integer[1]/text()";
            var matches = xpath.select(xpathQuery, doc);
            return Math.floor(parseInt(matches[0].nodeValue, 10) / 1000000);
        });
};

module.exports.isLocked = function(){
    return false; //TODO implement
    // check out http://stackoverflow.com/questions/11505255/osx-check-if-the-screen-is-locked
};