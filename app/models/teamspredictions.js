/**
 * Created by I305845 on 21/05/2016.
 */
// load the things we need
var mongoose = require('mongoose');

// define the schema for our user's predictions
var userPredictionsTeamsSchema = mongoose.Schema({
    teamId: Number,
    user_id: String,
    _team: String,
    score: Number
});

module.exports = mongoose.model('TeamsPredictions', userPredictionsTeamsSchema);