Template.inGame.helpers({
  number: function () { return this.number },
  displayedImages: function () {return Cards.find({active: this.number} ) }
});
