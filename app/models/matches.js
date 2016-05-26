/**
 * Created by I305845 on 21/05/2016.
 */
// load the things we need
var mongoose = require('mongoose');

// define the schema for our matches model
var matchesSchema = mongoose.Schema({
    matchID: Number,
    team1: String,
    team2: String,
    kickofftime: Date,
    winner: String,
    team1score: String,
    team2score: String,
    goaldiff: String,
    firstscore: String
});

module.exports = mongoose.model('Matches', matchesSchema);
