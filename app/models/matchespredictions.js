/**
 * Created by I305845 on 21/05/2016.
 */
var mongoose = require('mongoose');

// define the schema for our user's predictions
var userPredictionsMatchesSchema = mongoose.Schema({
    matchID: Number,
    user_id: String,
    _winner: String,
    _team1score: String,
    _team2score: String,
    _goaldiff: String,
    _firstscore: String,
    score: Number
});

module.exports = mongoose.model('MatchesPredictions', userPredictionsMatchesSchema);