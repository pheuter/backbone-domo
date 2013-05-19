# Backbone-Domo

Augment your views with DOM awareness

## Background

Knowing when an element is inserted into the DOM is an essential piece of information when it comes to developing web applications that depend on various UI states (such as height).

Backbone, especially [Marionette](http://marionettejs.com), does an excellent job providing developers with intuitive constructs for encapsuling and working with DOM elements. From initializers to destructors you can track the state of your Views with ease. Unfortunately, the View does not have any notion of being inserted into the DOM.

> Note, `render` does **not** imply a DOM insertion. What usually happens when a Backbone.View is rendered is its `el` gets populated with some data, but that `el` can be sitting somewhere in memory detached from the DOM.

It *is* possible to design your applications so that you can execute DOM-dependent logic after you *know* that the View you are working with should have been inserted into the DOM. Marionette's [Region](https://github.com/marionettejs/backbone.marionette/blob/master/src/marionette.region.js#L117-L133) triggers an `onShow` event on a View that has just been rendered onto a Region that exists in the DOM, implying that the View should be in the DOM as well.

There are some drawbacks to this pattern. While sometimes it is good design, you may not always want to show a View onto a Region. Coupling your Views to Regions just for the `onShow` may be overhead you could be better off without. Also, you may start to find your views implementing logic in `onShow` that should go into an `onRender` instead. `onShow` implies your View will be part of some layout or parent view but you may prefer to de-couple your views from their implementation and not have to constrain yourself.

This is where Backbone-Domo comes in.

## Domo arigato, Mr. Roboto

Backbone-Domo utilizes [Mutation observers](https://dvcs.w3.org/hg/domcore/raw-file/tip/Overview.html#mutation-observers) to efficiently react when your View's `el` gets inserted into the DOM and notify the View via an event.

Many browsers currently do not support Mutation observers, but luckily the [Polymer](https://github.com/Polymer) team developed a polyfill that Domo utilizes as a fallback.

## Usage

Using Backbone-Domo in your views couldn't get any simpler:

```javascript
initialize: function() {
  Backbone.Domo.arigato(this, 'dom:insert');

  this.listenTo(this, 'dom:insert', function(event) {
    console.log("View is now in the DOM!");
    console.log("View width: " + this.$el.width())
  });
}
```

When you're ready to close your view:

```javascript
close: function() {
  Backbone.Domo.detach(this);
  this.remove();
}
```

For more, check out the `src/` and `demo/` directories.