// var childProcess = require('child_process');
var config       = require('./common/config');
var logger       = require('./common/logger')(module);
var Q            = require('q');
var Slack        = require('./remote/slack');
var idleTimer    = require('./idletime/idleTimer');

var userConfig;
try {
    userConfig = require('../config');
} catch(e){
    userConfig = {};
}
config.init(userConfig);

var slack = new Slack(config.slack.authToken);

function main(){
    setInterval(getAndUpdatePresence, config.awayStatus.idleTimePollInterval);
    getAndUpdatePresence();

    logger.info("Started.");
}

function getAndUpdatePresence(){
    Q.all([idleTimer.getIdleTime(), idleTimer.isLocked()])
        .spread(isWorkstationIdle)
        .then(updateSlackPresence)
        .fail(function(err){
            logger.error(err, "Failed to get and update presence.");
            throw err;
        });
}

function updateSlackPresence(isWorkstationIdle){
    return slack.users.getPresence()
        .then(function(presence){
            var debugState = {
                slackPresence: presence,
                isWorkstationIdle: isWorkstationIdle
            };

            if(isWorkstationIdle){
                if(!presence.isAutomaticallyAway && !presence.isManuallyAway){
                    logger.info(debugState, "We're not using the computer, but Slack thinks we're online. Setting us to manually away.");
                    return slack.users.setPresence(true, false);
                }
            } else {
                if(presence.isManuallyAway){
                    logger.info(debugState, "We're using the computer, but we're set to manually away in Slack. Setting us to online.")
                    return slack.users.setPresence(false, true);
                } else {
                    logger.debug(debugState, "We're using the computer and Slack already thinks we're online. Sending an activity heartbeat to keep us active.");
                    return slack.users.setActive();
                }
            }
        });
}

function isWorkstationIdle(idleDuration, isLocked){
    return isLocked || (idleDuration > config.awayStatus.idleTimeBeforeAway);
}

main();