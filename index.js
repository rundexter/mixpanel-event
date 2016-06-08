var Mixpanel = require('mixpanel')
  , _        = require('lodash')
  , q        = require('q')
;

module.exports = {
  /**
   * The main entry point for the Dexter module
   *
   * @param {AppStep} step Accessor for the configuration for the step using this module.  Use step.input('{key}') to retrieve input data.
   * @param {AppData} dexter Container for all data used in this workflow.
   */
  run: function(step, dexter) {
    var trackers = step.inputObject(['event', 'properties'])
      , mixpanel = Mixpanel.init(step.input('token').first())
    ;

    q.all(
        _.map(trackers, function(tracker) {
          var deferred = q.defer();
          mixpanel.track(tracker.event, tracker.properties || {}, deferred.makeNodeResolver());
          return deferred.promise;
        })
      )
      .then(this.complete.bind(this))
      .catch(this.fail.bind(this));
  }
};
