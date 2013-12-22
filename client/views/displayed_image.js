Template.displayedImage.events({
  'click' : function () {
    //console.log(Session.get("game_state"))
    if (Session.get("game_state") === "voting_phase") {
      Cards.update( {_id: this._id}, {$inc: { votes: 1} } );
    }
  }
});
