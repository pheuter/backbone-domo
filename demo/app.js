document.addEventListener('DOMContentLoaded', function() {

  var MyView = Backbone.View.extend({
    id: 'my-view',

    initialize: function() {
      Backbone.Domo.arigato(this, 'dom:insert');

      this.listenTo(this, 'dom:insert', function(event) {
        console.log("View is now in the DOM!");
        console.log("View width: " + this.$el.width())
      });
    },


    render: function() {
      this.$el.append("<h1>My View!</h1>");

      this.onRender();

      return this;
    },

    onRender: function() {
      console.log("Just rendered view!");
      console.log("View width: " + this.$el.width());
    },

    close: function() {
      console.log("View is closing!");
      Backbone.Domo.detach(this);
      this.remove();
    }
  });


  var myView = new MyView();
  document.body.appendChild(myView.render().el);

  setTimeout(function() {
    myView.close();
  }, 2000);
});