/**
 * Created by I305845 on 21/05/2016.
 */
var mongoose = require('mongoose');

// define the schema for our matches model
var teamsSchema = mongoose.Schema({
    teamID: Number,
    name: String,
    team: String,
    deadline: Date,
    predictscore: Number
});

module.exports = mongoose.model('Teams', teamsSchema);