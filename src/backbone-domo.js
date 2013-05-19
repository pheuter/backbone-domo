/*
 * Copyright 2013 Mark Fayngersh. All rights reserved.
 * Use of this source code is governed by a MIT license
 * that can be found in the LICENSE file.
 */

(function(global) {

  // Fallback to MutationObserver polyfill if necessary
  var MutationObserver = global.MutationObserver || global.JsMutationObserver;

  if (MutationObserver == null) {
    throw new Error("Backbone.Domo could not initialize: \
                     MutationObserver is not supported!");
  }


  if (global.Backbone == null) {
    throw new Error("Backbone is not defined!");
  }



  var Domo = Backbone.Domo = {

    // Currently active MutationObserver objects mapped by Backbone.View cid
    _observers: {},

    // Attaches a Backbone.View to Domo and initializes a MutationObserver object.
    //
    // @param view [Backbone.View] A Backbone.View instance
    // @param eventName [String] The name of the event to trigger on the view
    arigato: function(view, eventName) {
      var _this = this;

      if (!(view.cid in this._observers)) {
        var observer = this._observers[view.cid] = new MutationObserver(function(records) {
          records.forEach(function(record) {
            if (record.type === 'childList' && record.addedNodes.length > 0) {
              for (var i = 0; i < record.addedNodes.length; ++i) {
                var node = record.addedNodes[i];
                if (node == view.el) {
                  view.trigger(eventName, record);
                }
              };
            }
          });
        });

        observer.observe(document, {
          childList: true,
          subtree: true
        });
      } else {
        console.warn("view already attached to Backbone.Domo!");
      }
    },

    // Disconnects the view's MutationObserver and deletes it.
    //
    // @param view [Backbone.View] The Backbone.View from which to detach
    detach: function(view) {
      this._observers[view.cid].disconnect();
      delete this._observers[view.cid];
    }
  };

})(this);