module.exports = function (app, passport) {
    var initialData = require('../app/initialData');
    var user = require('../app/models/user');
    var matches = require('../app/models/matches');
    var matchespredictions = require('../app/models/matchespredictions');
    var teams = require('../app/models/teams');
    var teamspredictions = require('../app/models/teamspredictions');
    var http = require('http');
    var Q = require('q');

    // Initial Data:
    app.get('/api/initial', isLoggedIn, function (req, res) {
        var user_id = req.user._id;
        user.findOne({_id: user_id}, function (error, user) {
            var response = {};
            if (error) {
                errorWrapper(response, res);
            } else {
                initialData.insertData(matches, teams);

                updateUsersScores();

                // done:
                response.status = 'OK';
                response.user = removeSensitiveInfo(user);
                return res.json(200, response);
            }
        });
    });

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================
    // LOGOUT ==============================
    app.get('/api/logout', function (req, res) {
        req.logout();
        res.json(200, {
            status: 'OK',
            message: 'Logged Out'
        });
    });

    // LOGIN ===============================
    app.post('/api/login', function handleLocalAuthentication(req, res, next) {//Utilizing custom callback to send json objects
        passport.authenticate('local-login', function (err, user, message) {
            if (err) {
                return next(err);
            }
            var response = {};
            if (!user) {
                response.status = 'ERROR';
                response.message = message;
                return res.json(200, response);
            }

            // Manually establish the session...
            req.login(user, function (err) {
                if (err) {
                    return next(err);
                }
                response.status = 'OK';
                response.user = removeSensitiveInfo(user);
                return res.json(200, response);
            });

        })(req, res, next);
    });

    // SIGNUP =================================
    app.post('/api/signup', function handleLocalAuthentication(req, res, next) { //Utilizing custom callback to send json objects
        passport.authenticate('local-signup', function (err, user, message) {
            if (err) {
                return next(err);
            }
            var response = {};
            if (!user) {
                errorWrapper(response, res);
            }
            // Manually establish the session...
            req.login(user, function (err) {
                if (err) {
                    return next(err);
                }
                response.status = 'OK';
                response.user = removeSensitiveInfo(user);

                return res.json(200, response);
            });
        })(req, res, next);
    });

    app.get('/api/loggedin', function (req, res) {
        res.send(req.isAuthenticated() ? req.user : '0');
    });

    app.get('/api/user', isLoggedIn, function (req, res) {
        var user_id = req.user._id;
        user.findOne({_id: user_id}, function (error, user) {
            var response = {};
            if (!error) {
                response.status = 'OK';
                response.user = removeSensitiveInfo(user);
                res.json(200, response);
            } else {
                errorWrapper(response, res);
            }
        });
    });

    app.get('/api/users', isLoggedIn, function (req, res) {
        user.find({}, function (err, users) {
            var userMap = {};

            users.forEach(function (user) {
                userMap[user._id] = removeSensitiveInfo(user);
            });

            var response = {};
            response.status = 'OK';
            var byScore = users.slice(0);
            byScore.sort(function (a, b) {
                // return b.game.score - a.game.score;
            });

            response.users = byScore;
            res.json(200, response);
        });
    });

// =============================================================================
// Game ROUTES =================================================================
// =============================================================================
    function updateUsersScores() {
        // update user matches:
        matchespredictions.find({}, function (err, matchespredictionsRows) {
            matchespredictionsRows.forEach(function (matchespredictionsRow) {
                // find related match:
                matches.find({matchID: matchespredictionsRow.matchID}, function (err, matchRelated) {
                    matchespredictionsRow.score = 0;
                    if (typeof(matchRelated[0].winner) !== 'undefined' && matchRelated[0].winner === matchespredictionsRow._winner) {
                        matchespredictionsRow.score += 2;
                    }

                    if (typeof(matchRelated[0].team1score) !== 'undefined' && matchRelated[0].team1score === matchespredictionsRow._team1score) {
                        matchespredictionsRow.score += 2;
                    }

                    if (typeof(matchRelated[0].team2score) !== 'undefined' && matchRelated[0].team2score === matchespredictionsRow._team2score) {
                        matchespredictionsRow.score += 2;
                    }

                    if (typeof(matchRelated[0].goaldiff) !== 'undefined' && matchRelated[0].goaldiff === matchespredictionsRow._goaldiff) {
                        matchespredictionsRow.score += 2;
                    }

                    if (typeof(matchRelated[0].firstscore) !== 'undefined' && matchRelated[0].firstscore === matchespredictionsRow._firstscore) {
                        matchespredictionsRow.score += 2;
                    }
                    matchespredictionsRow.save();
                });
            });
        });

        // update user teams:
        teamspredictions.find({}, function (err, teamspredictionsRows) {
            teamspredictionsRows.forEach(function (teamspredictionsRow) {
                // find related match:
                teams.find({teamID: teamspredictionsRow.teamID}, function (err, teamRelated) {
                    teamspredictionsRow.score = 0;
                    if (typeof(teamRelated[0].team) !== 'undefined' && teamRelated[0].team === teamspredictionsRow._team) {
                        teamspredictionsRow.score += typeof(teamRelated[0].predictscore) === 'number' ? teamRelated[0].predictscore : 0;
                    }

                    teamspredictionsRow.save();
                });
            });
        });

        // update user total score:
        user.find({}, function (err, users) {
            users.forEach(function (user) {
                // starting from 0:
                user.score = 0;
                user.save();

                matchespredictions.find({user_id: user._id}, function (err, matchespredictionsRows) {
                    matchespredictionsRows.forEach(function (matchespredictionsRow) {
                        user.score += typeof(matchespredictionsRow.score) === 'number' ? matchespredictionsRow.score : 0;
                    });
                    user.save();
                });

                teamspredictions.find({user_id: user._id}, function (err, teamspredictionsRows) {
                    teamspredictionsRows.forEach(function (teamspredictionsRow) {
                        user.score += typeof(teamspredictionsRow.score) === 'number' ? teamspredictionsRow.score : 0;
                    });
                    user.save();
                });
            });
        });
    };

    function updateMatchPrediction(matchesInput, user_id) {
        var deferred = Q.defer();

        if (matchesInput) {
            matchesInput.forEach(function (aMatch) {

                // check if match is exist:
                matches.find({matchID: aMatch.matchID}).limit(1).exec(function (error, dbMatch) {
                    if (!error && dbMatch[0]) {
                        // check if we can update this item
                        var isTimePassed = dbMatch[0].kickofftime.getTime() - (new Date()).getTime() < 0;

                        if (!isTimePassed) {

                            // update match prediction with recent values
                            matchespredictions.find({
                                matchID: aMatch.matchID,
                                user_id: user_id
                            }).limit(1).exec(function (error, dbMatchPrediction) {
                                if (!error && dbMatchPrediction[0] && dbMatchPrediction[0] !== null && typeof (dbMatchPrediction[0]) !== 'undefined') {
                                    dbMatchPrediction[0]._winner = aMatch._winner;
                                    dbMatchPrediction[0]._team1score = aMatch._team1score;
                                    dbMatchPrediction[0]._team2score = aMatch._team2score;
                                    dbMatchPrediction[0]._goaldiff = aMatch._goaldiff;
                                    dbMatchPrediction[0]._firstscore = aMatch._firstscore;
                                    dbMatchPrediction[0].save();
                                } else if (aMatch.matchID !== null && typeof (aMatch.matchID) !== 'undefined') {
                                    new matchespredictions({
                                        matchID: aMatch.matchID,
                                        user_id: user_id,
                                        _winner: aMatch._winner,
                                        _team1score: aMatch._team1score,
                                        _team2score: aMatch._team2score,
                                        _goaldiff: aMatch._goaldiff,
                                        _firstscore: aMatch._firstscore
                                    }).save(function (err) {
                                    });
                                }
                            });
                        }
                    }
                });
            }, function () {
                deferred.resolve({});
            });

        } else {
            deferred.resolve({});
        }
        return deferred.promise;
    };

    function updateTeamPrediction(teamsInput, user_id) {
        var deferred = Q.defer();
        if (teamsInput) {
            teamsInput.forEach(function (aTeam) {
                // check if team is exist:
                teams.find({teamID: aTeam.teamID}).limit(1).exec(function (error, dbTeam) {
                    if (!error && dbTeam[0]) {
                        // check if we can update this item
                        var isTimePassed = dbTeam[0].deadline.getTime() - (new Date()).getTime() < 0;

                        if (!isTimePassed) {
                            // update match prediction with recent values
                            teamspredictions.find({
                                teamID: aTeam.teamID,
                                user_id: user_id
                            }).limit(1).exec(function (error, dbTeamPrediction) {
                                if (!error && dbTeamPrediction[0] !== null && typeof (dbTeamPrediction[0]) !== 'undefined') {
                                    dbTeamPrediction[0]._team = aTeam._team;
                                    dbTeamPrediction[0].save();


                                } else if (aTeam._team !== null && typeof (aTeam._team) !== 'undefined') {
                                    new teamspredictions({
                                        teamID: aTeam.teamID,
                                        user_id: user_id,
                                        _team: aTeam._team
                                    }).save(function (err) {

                                    });
                                }
                            });
                        }
                    }
                });
            }, function () {
                deferred.resolve({});
            });
        } else {
            deferred.resolve({});
        }
        return deferred.promise;
    };

    app.post('/api/saveChangesMatches', isLoggedIn, function (req, res) {
        var user_id = req.user._id;
        user.findOne({_id: user_id}, function (error, user) {
            var response = {};
            if (error) {
                errorWrapper(response, res);
            } else {
                response.status = 'OK';
                updateMatchPrediction(req.body.matches, user_id).then(
                    res.send(200, response)
                );
            }
        });
    });

    app.post('/api/saveChangesTeams', isLoggedIn, function (req, res) {
        var user_id = req.user._id;
        user.findOne({_id: user_id}, function (error, user) {
            var response = {};
            if (error) {
                errorWrapper(response, res);
            } else {
                response.status = 'OK';
                updateTeamPrediction(req.body.teams, user_id).then(
                    res.send(200, response)
                );
            }
        });
    });

    function sortByMatchID(arr) {
        var arrSorted = arr.slice(0);
        arrSorted.sort(function (a, b) {
            return a.matchID - b.matchID;
        });
        return arrSorted;
    }

    function sortByTeamID(arr) {
        var arrSorted = arr.slice(0);
        arrSorted.sort(function (a, b) {
            return a.teamID - b.teamID;
        });
        return arrSorted;
    }

    function getAllUserPrediction(user_id, res) {
        user.findOne({_id: user_id}, function (error, user) {
            var response = {};
            if (error) {
                errorWrapper(response, res);
            } else {
                response.status = 'OK';
                response.user = removeSensitiveInfo(user);

                // get all matches:
                matches.find({}, function (err, matches) {
                    if (!error) {
                        response.matches = sortByMatchID(removeSensitiveInfoArray(matches));

                        // get all user's matches predictions
                        matchespredictions.find({user_id: user_id}, function (err, matchespredictions) {
                            if (!error) {
                                response.matchespredictions = sortByMatchID(removeSensitiveInfoArray(matchespredictions));

                                // get all teams:
                                teams.find({}, function (err, teams) {
                                    if (!error) {
                                        response.teams = sortByTeamID(removeSensitiveInfoArray(teams));

                                        // get all user's teams predictions
                                        teamspredictions.find({user_id: user_id}, function (err, teamspredictions) {
                                            if (!error) {
                                                response.teamspredictions = sortByTeamID(removeSensitiveInfoArray(teamspredictions));

                                                res.json(200, response);
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    }

    app.get('/api/predictions', isLoggedIn, function (req, res) {
        getAllUserPrediction(req.user._id, res);
    });

// =============================================================================
// Helpers =====================================================================
// =============================================================================

// route middleware to ensure user is logged in
    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            res.send('You are not logged in');
        }
    }

    function removeSensitiveInfo(user) {
        user.__v = undefined;
        user._id = undefined;
        user.password = undefined;

        return user;
    }

    function removeSensitiveInfoArray(arr) {
        if (arr) {
            arr.forEach(function (item) {
                item._id = undefined;
                item.__v = undefined;
                item.user_id = undefined;
            })
        }
        return arr;
    }

    function errorWrapper(innerRes, res) {
        innerRes.status = 'ERROR';
        innerRes.message = 'Something Went Wrong';
        res.json(200, innerRes);
    }
};