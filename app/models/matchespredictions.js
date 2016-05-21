/**
 * Created by I305845 on 21/05/2016.
 */
var mongoose = require('mongoose');

// define the schema for our user's predictions
var userPredictionsMatchesSchema = mongoose.Schema({
    matchID: Number,
    username: String,
    winner: String,
    team1score: Number,
    team2score: Number,
    goaldiff: Number,
    firstscore: String
});

module.exports = mongoose.model('MatchesPredictions', userPredictionsMatchesSchema);