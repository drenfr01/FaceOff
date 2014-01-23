Template.game.events({
  'click' : function () {
    //need a call to server side message to update users
    Router.go('inGame', {number: this.number});
  }
});
