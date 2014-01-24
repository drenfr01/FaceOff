Template.displayedImage.helpers({
  path: function() {return this.path;},
  votes: function() {return this.usersVoting.length;}

});

Template.displayedImage.events({
  'click': function() {
    //Voting data model:
    //add userIDs to image, sum for count, 
    //Dumb way: adding has_voted flag to userId, flip it
    Meteor.call('voteForImage', Meteor.userId(), this._id, 
      function(error, response) {
        if(error)
          alert(error.reason);
      });
  }
});
