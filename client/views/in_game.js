Template.inGame.helpers({
  number: function () { return this.number },
  displayedImages: function () {return Cards.find({active: this.number, in_play: this.number} ) },
  time: function() { return Timer.findOne({game: this.number}).time }
});
