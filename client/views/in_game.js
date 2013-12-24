Template.inGame.events({
  'click' : function () {
      Cards.update( {_id: this._id}, {$inc: { votes: 1} } );
  }
});
