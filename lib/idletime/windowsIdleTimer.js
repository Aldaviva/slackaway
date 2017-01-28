/*
 * Upgrading past winapi@2.2.0 requires upgrading Node.js to a version that supports ECMAScript 6
 */
var Q      = require('q');
var winapi = require('winapi');
var lockYourWindows = require('lock-your-windows');

/**
 * @return Number of milliseconds since the keyboard or mouse of the local workstation were used
 */
module.exports.getIdleTime = function(){
    return Q(winapi.getIdleTime());
};

/**
 * @return Boolean true if Windows is currently locked (Win+L), and false if it's unlocked
 */
module.exports.isLocked = function(){
    return Q(lockYourWindows.isLocked());
};