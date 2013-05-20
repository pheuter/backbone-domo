document.addEventListener('DOMContentLoaded', function() {

  var MyView = Backbone.View.extend({

    initialize: function() {
      Backbone.Domo.arigato(this);

      this.listenTo(this, 'domo:insert', this.onDomInsert);
      this.listenTo(this, 'domo:detach', this.onDomoDetach);
    },

    render: function() {
      this.$el.append("<h1>My View</h1>");
      this.onRender();

      return this;
    },

    onRender: function() {
      console.log("Just rendered view!");
      console.log("View width: " + this.$el.width());
    },

    onDomInsert: function(event) {
      console.log("View is now in the DOM!");
      console.log("View width: " + this.$el.width());
    },

    onDomoDetach: function() {
      console.log("Domo now detached from view");
    },

    close: function() {
      // Domo.detach should be called by this point
      // After 'domo:insert' event is fired, `detach` is called for performance.
      //
      // It's still a good idea to manually call `detach()` when a view is closed, just in case
      //   it was never inserted into the DOM.
      Backbone.Domo.detach(this);

      this.remove();

      console.log("View is now closed");
    }
  });


  var myView = new MyView();
  document.body.appendChild(myView.render().el);

  setTimeout(function() {
    myView.close();
  }, 1000);
});