require('any-promise/register/q');

var _       = require('lodash');
var config  = require('../common/config');
var logger  = require('../common/logger')(module);
var Q       = require('q');
var request = require('request-promise-any');

request = request.defaults({ resolveWithFullResponse: true });

function Slack(authToken){
    _.bindAll(this);
    bindAllGrandchildren(this);

    this.authToken = authToken;
}

module.exports = Slack;

Slack.BASE_URI = "https://slack.com/api/";

Slack.prototype.sendRequest = function(apiMethodName, params){
    return request({
            url: Slack.BASE_URI + apiMethodName,
            method: "POST",
            json: true,
            form: _.extend({
                token: this.authToken,
            }, params)
        })
        .then(transformSlackErrors);
};

Slack.prototype.users = {};

/**
 * @param userId optional Slack ID of the user to get, or pass null/undefined/"" for the user that owns the auth token. example: "U17FD0BEH"
 */
Slack.prototype.users.getPresence = function(userId){
    return this.sendRequest("users.getPresence", {
        user: userId || ""
    })
    .then(function(res){
        return {
            isAutomaticallyAway: res.body.auto_away,
            isManuallyAway: res.body.manual_away,
            effectivePresence: res.body.presence
        };
    });
};

/**
 * @param isAway Boolean true if you want to manually set yourself away, or false if you want your presence to only come from your idle time
 * @param alsoSetActive Boolean true if this call should also include a set_active param to update your idle time heartbeat
 */
Slack.prototype.users.setPresence = function(isAway, alsoSetActive){
    return this.sendRequest("users.setPresence", {
        presence: (isAway) ? "away" : "auto",
        set_active: !!alsoSetActive
    });
};

Slack.prototype.users.setActive = function(){
    return this.sendRequest("users.setActive");
};

function transformSlackErrors(res){
    if(!res.body.ok){
        throw new Error("Slack error: "+res.body.error);
    } else {
        return res;
    }
}

function bindAllGrandchildren(object){
    _.forIn(object, function(apiMethodFamily, apiMethodFamilyName){
        if(_.isPlainObject(apiMethodFamily)){
            _.forIn(apiMethodFamily, function(apiMethod, apiMethodName){
                apiMethodFamily[apiMethodName] = _.bind(apiMethod, object);
            });
        }
    });
}