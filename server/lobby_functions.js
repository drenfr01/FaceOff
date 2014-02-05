Meteor.methods({
  assignCards: function(attributes) {
    // Attributes needs to pass a game number, we can get users and cards from that info
    gameNumber = attributes.number
    // A user will know about their cards
    // Find cards will take in two users and select a random card from each
    // Cards will still know their game and will be in play, and active in games
    // Cards will still be displayed based on their in_play values



    //split number of cards assigned to this game to each users
  }
});
