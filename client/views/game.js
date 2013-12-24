Template.game.events({
  'click' : function () {
    Router.go('inGame', {number: this.number});
  }
});
