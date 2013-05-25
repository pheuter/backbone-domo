/*
 * Copyright 2013 Mark Fayngersh. All rights reserved.
 * Use of this source code is governed by a MIT license
 * that can be found in the LICENSE file.
 *
 * Version 0.1.1
 */

Backbone.Domo = (function(Backbone) {
  // Fallback to MutationObserver polyfill if necessary
  var MutationObserver = MutationObserver || JsMutationObserver;

  if (MutationObserver == null) {
    throw new Error("Backbone.Domo could not initialize: \
                     MutationObserver is not supported!");
  }

  // Currently active MutationObserver objects mapped by Backbone.View cid
  var _observers = {};

  // Attaches a Backbone.View to Domo and initializes a MutationObserver object
  //
  // @param view [Backbone.View] A Backbone.View instance
  // @param options [Object] An optional hash of options

  // @option options eventName [String] Name of event that will trigger on the view when el is
  //   inserted into the DOM, defaults to 'domo:insert'
  function arigato(view, options) {
    if (options == null) {
      options = {};
    }

    var eventName = options.eventName || 'domo:insert';

    if (!(view.cid in _observers)) {
      var observer = _observers[view.cid] = new MutationObserver(function(records) {
        records.forEach(function(record) {
          if (record.type === 'childList' && record.addedNodes.length > 0) {
            for (var i = 0; i < record.addedNodes.length; ++i) {
              var node = record.addedNodes[i];
              if (node === view.el) {
                view.trigger(eventName, record);
                detach(view);
                return;
              }
            }
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
  }

  // Disconnects the view's MutationObserver and deletes it
  //
  // Upon detachment, Domo will trigger a 'domo:detach' event on the view
  //
  // @param view [Backbone.View] The Backbone.View from which to detach
  function detach(view) {
    var observer;

    if (observer = _observers[view.cid]) {
      observer.disconnect();
      delete _observers[view.cid];
      observer = null;
      view.trigger('domo:detach');
    }
  }

  //  Public API
  return {
    arigato: arigato,
    detach: detach
  };
})(Backbone);

