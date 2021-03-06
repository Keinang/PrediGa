module.exports = function (app, passport) {
    var initialData = require('../app/initialData');
    var user = require('../app/models/user');
    var matches = require('../app/models/matches');
    var matchespredictions = require('../app/models/matchespredictions');
    var teams = require('../app/models/teams');
    var teamspredictions = require('../app/models/teamspredictions');
    var http = require('http');
    var Q = require('q');

    /*
     on server start up:
     var initialDataService = function initialDataService() {
     initialData.insertData(matches, teams).then(function () {
     updateUsersScores();
     console.log('Done updating initial data.');
     });

     };

     // Calling this function when server start:
     initialDataService();
     */

    // Initial Data REST:
    app.get('/api/initial', isLoggedIn, function (req, res) {
        var user_id = req.user._id;
        user.findOne({_id: user_id}, function (error, user) {
            var response = {};
            if (error || !isAdminUser(user)) {
                response.status = 'ERROR';
                return res.json(200, response);
            } else {
                initialData.insertData(matches, teams).then(function () {
                    console.log('Done updating initial data.');

                    // done:
                    response.status = 'OK';
                    response.user = removeSensitiveInfo(user);
                    return res.json(200, response);
                });
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
                if (isAdminUser(user)) {
                    user.isAdmin = true;
                    user.save(function () {
                        response.user = removeSensitiveInfo(user);
                        return res.json(200, response);
                    });
                } else {
                    response.user = removeSensitiveInfo(user);
                    return res.json(200, response);
                }
            });

        })(req, res, next);
    });

    // SIGNUP =================================
    app.post('/api/signup', function handleLocalAuthentication(req, res, next) { //Utilizing custom callback to send json objects
        var response = {};
        passport.authenticate('local-signup', function (err, user, message) {
            if (err) {
                return next(err);
            }

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
                // Creating 1st dummy games:
                // Test match:
                new matchespredictions({
                    matchID: 52,
                    user_id: user._id,
                    team1: 'T2',
                    team2: 'T1',
                    _winner: 'T2',
                    _team1score: '1',
                    _team2score: '0',
                    _goaldiff: '0',
                    _firstscore: 'T1'
                }).save(function (err) {
                });
                new teamspredictions({
                    teamID: 19,
                    user_id: user._id,
                    _team: 'T2'
                }).save(function () {

                });

                response.user = removeSensitiveInfo(user);

                return res.json(200, response);
            });
        })(req, res, next);
    });

    app.get('/api/loggedin', function (req, res) {
        res.send(req.isAuthenticated() ? removeSensitiveInfo(req.user) : '0');
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
            var response = {};
            response.status = 'OK';

            // filter admin + sensitive values:
            var filtered = [];

            users = sortByScore(users);
            var place = 1;
            var currentScore = users[1].score;
            var positionsToAdd = 0;

            for (var i = 0; i < users.length; i++) {
                var user = users[i];
                if (!isAdminUser(user) && !isDemoUser(user)) {
                    if (user.score < currentScore) {
                        currentScore = user.score;
                        place += positionsToAdd;
                        positionsToAdd = 1;
                    } else {
                        positionsToAdd += 1;
                    }
                    user.place = place;
                    filtered.push(removeSensitiveInfo(user));
                }
            }

            response.users = filtered;
            res.json(200, response);
        });
    });

// =============================================================================
// Game ROUTES =================================================================
// =============================================================================
    // admin flow
    // ~~~~~~~~~~~~~~~~~~~~~~~~~
    function updateUsersTotalScores() {
        var deferred = Q.defer();

        // update user total score:
        user.find({}, function (err, users) {
            // Before updating, sorting by place to update the last place:
            users = sortByScore(users);
            var place = 1;
            var currentScore = users[1].score;
            var positionsToAdd = 0;

            for (var i = 0; i < users.length; i++) {
                var user = users[i];
                if (!isAdminUser(user) && !isDemoUser(user)) {
                    if (user.score < currentScore) {
                        currentScore = user.score;
                        place += positionsToAdd;
                        positionsToAdd = 1;
                    } else {
                        positionsToAdd += 1;
                    }
                    user.lastplace = place;
                }
            }

            users.forEach(function (user) {
                //console.log('updateUsersTotalScores:' + user.username);

                // starting from 0:
                var totalScore = 0;
                var strikes = 0;

                matchespredictions.find({user_id: user._id}, function (err, matchespredictionsRows) {
                    if (matchespredictionsRows) {
                        matchespredictionsRows.forEach(function (matchespredictionsRow) {
                            totalScore += typeof(matchespredictionsRow.score) === 'number' ? matchespredictionsRow.score : 0;
                            if (matchespredictionsRow.score === 10) {
                                strikes += 1;
                            }
                        });
                    }

                    teamspredictions.find({user_id: user._id}, function (err, teamspredictionsRows) {
                        if (teamspredictionsRows) {
                            teamspredictionsRows.forEach(function (teamspredictionsRow) {
                                totalScore += typeof(teamspredictionsRow.score) === 'number' ? teamspredictionsRow.score : 0;
                            });
                        }
                        // Finish iterating, saving the total score:
                        user.score = totalScore;
                        user.strikes = strikes;
                        user.save(function (err) {

                        });
                    });
                });

            }, function (err) {
                deferred.resolve({});
            });

            // after the loop:
            deferred.resolve();
        });

        return deferred.promise;
    }

    function updateTeamsPredictionsScore() {
        var deferred = Q.defer();

        // update user teams:
        teamspredictions.find({}, function (err, teamspredictionsRows) {
            if (teamspredictionsRows) {
                teamspredictionsRows.forEach(function (teamspredictionsRow) {
                    //console.log('updateTeamsPredictionsScore:' + teamspredictionsRow.teamID);

                    // find related match:
                    teams.findOne({teamID: teamspredictionsRow.teamID}, function (err, teamRelated) {
                        teamspredictionsRow.score = 0;
                        if (typeof(teamRelated) !== 'undefined' && typeof(teamRelated.team) !== 'undefined' && teamRelated.team === teamspredictionsRow._team) {
                            teamspredictionsRow.score += typeof(teamRelated.predictscore) === 'number' ? teamRelated.predictscore : 0;
                        }

                        teamspredictionsRow.save(function (err) {
                            //console.log('updateTeamsPredictionsScore save:' + teamspredictionsRow.teamID);
                        });
                    });

                }, function (err) {
                    deferred.resolve()
                });

                // after the loop:
                deferred.resolve();

            } else {
                deferred.resolve()
            }
        });

        return deferred.promise;
    }

    function updateMatchPredictionsScores() {
        var deferred = Q.defer();
        //console.log('updateMatchPredictionsScores start');
        matchespredictions.find({}, function (err, matchespredictionsRows) {
            if (matchespredictionsRows) {
                matchespredictionsRows.forEach(function (matchespredictionsRow) {
                    //console.log('updateMatchPredictionsScores:' + matchespredictionsRow.matchID);

                    // find related match:
                    matches.findOne({matchID: matchespredictionsRow.matchID}, function (err, matchRelated) {
                        matchespredictionsRow.score = 0;
                        if (matchRelated) {
                            if (typeof(matchRelated.winner) !== 'undefined' && matchRelated.winner === matchespredictionsRow._winner) {
                                matchespredictionsRow.score += 2;
                            }

                            if (typeof(matchRelated.team1score) !== 'undefined' && matchRelated.team1score === matchespredictionsRow._team1score) {
                                matchespredictionsRow.score += 2;
                            }

                            if (typeof(matchRelated.team2score) !== 'undefined' && matchRelated.team2score === matchespredictionsRow._team2score) {
                                matchespredictionsRow.score += 2;
                            }

                            if (typeof(matchRelated.goaldiff) !== 'undefined' && matchRelated.goaldiff === matchespredictionsRow._goaldiff) {
                                matchespredictionsRow.score += 2;
                            }

                            if (typeof(matchRelated.firstscore) !== 'undefined' && matchRelated.firstscore === matchespredictionsRow._firstscore) {
                                matchespredictionsRow.score += 2;
                            }
                        }

                        matchespredictionsRow.save(function (err) {
                            //console.log('updateMatchPredictionsScores save:' + matchespredictionsRow.matchID);
                        });
                    });

                }, function (err) {
                    deferred.resolve()
                });

                // after the loop:
                deferred.resolve();
            } else {
                deferred.resolve()
            }
        });

        return deferred.promise;
    }

    function updateUsersScores() {
        var deferred = Q.defer();
        updateMatchPredictionsScores().then(function () {
            updateTeamsPredictionsScore().then(function () {
                updateUsersTotalScores().then(function () {
                    deferred.resolve()
                })
            })
        });
        return deferred.promise;
    }

    // regular user flow
    // ~~~~~~~~~~~~~~~~~~~~~~~~~

    // update matches and teams:
    function updateMatchPredictionValues(matchesInput, user) {
        var deferred = Q.defer();

        if (matchesInput) {
            matchesInput.forEach(
                function (aMatch) {
                    //console.log('updateMatchPredictionValues:' + aMatch.matchID);

                    // check if match is exist:
                    matches.findOne({matchID: aMatch.matchID}, function (error, dbMatch) {
                        if (!error && dbMatch) {
                            // if admin, we need to update the match itself:
                            var isAdmin = isAdminUser(user);

                            // check if we can update this item
                            var isTimePassed = getIfTimePassed(dbMatch.kickofftime);

                            if (!isTimePassed || isAdmin) {

                                // update match prediction with recent values
                                matchespredictions.findOne({
                                    matchID: aMatch.matchID,
                                    user_id: user._id
                                }, function (error, dbMatchPrediction) {
                                    //console.log('updateMatchPredictionValues (matchespredictions):' + aMatch.matchID);

                                    if (!isAdmin) {
                                        // having default values for all matches:
                                        // Default were removed becuase of too many bugs reported.
                                        /*aMatch._winner = aMatch._winner || "Draw";
                                        aMatch._team1score = aMatch._team1score || 0;
                                        aMatch._team2score = aMatch._team2score || 0;
                                        aMatch._goaldiff = aMatch._goaldiff || 0;
                                         aMatch._firstscore = aMatch._firstscore || "None";*/
                                    }

                                    if (!error && dbMatchPrediction) {
                                        dbMatchPrediction._winner = aMatch._winner;
                                        dbMatchPrediction._team1score = aMatch._team1score;
                                        dbMatchPrediction._team2score = aMatch._team2score;
                                        dbMatchPrediction._goaldiff = aMatch._goaldiff;
                                        dbMatchPrediction._firstscore = aMatch._firstscore;
                                        dbMatchPrediction.save(function (err) {
                                            //console.log('updateMatchPredictionValues (matchespredictions) save:' + aMatch.matchID);
                                        });
                                        // no prediction in db, creating new one
                                    } else if (aMatch.matchID !== null && typeof (aMatch.matchID) !== 'undefined') {
                                        new matchespredictions({
                                            matchID: aMatch.matchID,
                                            user_id: user._id,
                                            _winner: aMatch._winner,
                                            _team1score: aMatch._team1score,
                                            _team2score: aMatch._goaldiff,
                                            _goaldiff: aMatch._goaldiff,
                                            _firstscore: aMatch._firstscore
                                        }).save(function (err) {
                                            //console.log('updateMatchPredictionValues (matchespredictions) save:' + aMatch.matchID);
                                        });
                                    }
                                });
                            }

                            // update real matches
                            if (isAdmin) {
                                dbMatch.winner = aMatch._winner;
                                dbMatch.team1score = aMatch._team1score;
                                dbMatch.team2score = aMatch._team2score;
                                dbMatch.goaldiff = aMatch._goaldiff;
                                dbMatch.firstscore = aMatch._firstscore;
                                dbMatch.save(function (err) {
                                    //console.log('updateMatchPredictionValues (matchespredictions) save admin:' + aMatch.matchID);
                                });
                            }
                        } else {
                            //console.log('updateMatchPredictionValues resolved');
                            deferred.resolve({});
                        }
                    });


                }, function () {
                    deferred.resolve();
                });
            // after the for each
            //console.log('updateMatchPredictionValues resolved');
            deferred.resolve({});

        } else {
            //console.log('updateMatchPredictionValues resolved');
            deferred.resolve({});
        }
        return deferred.promise;
    }

    function updateTeamPredictionValues(teamsInput, user) {
        var deferred = Q.defer();
        if (teamsInput) {
            teamsInput.forEach(function (aTeam) {
                // check if team is exist:
                teams.findOne({teamID: aTeam.teamID}, function (error, dbTeam) {
                    if (!error && dbTeam) {

                        // if admin, we need to update the match itself:
                        var isAdmin = isAdminUser(user);

                        // check if we can update this item
                        var isTimePassed = getIfTimePassed(dbTeam.deadline);

                        if (!isTimePassed || isAdmin) {
                            // update match prediction with recent values
                            teamspredictions.findOne({
                                teamID: aTeam.teamID,
                                user_id: user._id
                            }, function (error, dbTeamPrediction) {
                                if (!error && dbTeamPrediction) {
                                    dbTeamPrediction._team = aTeam._team;
                                    dbTeamPrediction.save();


                                } else if (aTeam._team !== null && typeof (aTeam._team) !== 'undefined') {
                                    new teamspredictions({
                                        teamID: aTeam.teamID,
                                        user_id: user._id,
                                        _team: aTeam._team
                                    }).save(function (err) {

                                    });
                                }
                            });
                        }

                        // update real teams
                        if (isAdmin) {
                            dbTeam.team = aTeam._team;

                            dbTeam.save(function () {

                            });
                        }
                    } else {
                        deferred.resolve({});
                    }
                });
            }, function () {
                deferred.resolve({});
            });

            deferred.resolve({});
        } else {
            deferred.resolve({});
        }
        return deferred.promise;
    }

    app.post('/api/saveChangesMatches', isLoggedIn, function (req, res) {
        var user_id = req.user._id;
        user.findOne({_id: user_id}, function (error, user) {
            var response = {};
            if (error) {
                errorWrapper(response, res);
            } else {
                response.status = 'OK';
                updateMatchPredictionValues(req.body.matches, user).then(
                    function () {
                        if (isAdminUser(user)) {
                            updateUsersScores().then(function () {
                                res.send(200, response)
                            })
                        } else {
                            res.send(200, response)
                        }
                    }
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
                updateTeamPredictionValues(req.body.teams, user).then(
                    function () {
                        if (isAdminUser(user)) {
                            updateUsersScores().then(function () {
                                res.send(200, response)
                            })
                        } else {
                            res.send(200, response)
                        }
                    }
                );
            }
        });
    });

    //teamsSimulator
    app.get('/api/teamsSimulator', isLoggedIn, function (req, res) {
        var teamId = req.query.teamId;
        var user_id = req.user._id;
        user.findOne({_id: user_id}, function (error, aUser) {
            var response = {};
            if (error || !aUser) {
                errorWrapper(response, res);
            } else {
                response.status = 'OK';
                response.user = removeSensitiveInfo(aUser);
                teams.find({}, function (err, teams) {
                    if (!error) {
                        response.teams = sortByID(removeSensitiveInfoArray(teams), '2');

                        user.find({}, function (error, allUsers) {
                            response.users = removeSensitiveInfoArrayAndAdmin(allUsers);

                            // get all other user's matches predictions until this kickoff
                            teamspredictions.find({teamID: teamId}, function (err, teamspredictions) {
                                if (!error && teamspredictions) {
                                    if (isAdminUser(aUser)) {
                                        response.teamspredictions = removeAdminFromPredictions(teamspredictions, response.users);
                                    } else {
                                        response.teamspredictions = removeSensitiveInfoArrayWithDateAndAdmin(teamspredictions, response.teams, '2', response.users);
                                    }

                                    res.json(200, response);
                                } else {
                                    res.json(200, response);
                                }
                            });
                        });
                    } else {
                        res.json(200, response);
                    }
                });
            }
        });
    });
    // match simulator
    app.get('/api/matchSimulator', isLoggedIn, function (req, res) {
        var matchId = req.query.matchId;
        var user_id = req.user._id;
        user.findOne({_id: user_id}, function (error, aUser) {
            var response = {};
            if (error || !aUser) {
                errorWrapper(response, res);
            } else {
                response.status = 'OK';
                response.user = removeSensitiveInfo(aUser);
                matches.find({}, function (err, matches) {
                    if (!error) {
                        response.matches = sortByID(removeSensitiveInfoArray(matches), '1');

                        user.find({}, function (error, allUsers) {
                            response.users = removeSensitiveInfoArrayAndAdmin(allUsers);

                            // get all other user's matches predictions until this kickoff
                            matchespredictions.find({matchID: matchId}, function (err, matchespredictions) {
                                if (!error && matchespredictions) {
                                    if (isAdminUser(aUser)) {
                                        response.matchespredictions = removeAdminFromPredictions(matchespredictions, response.users);
                                    } else {
                                        response.matchespredictions = removeSensitiveInfoArrayWithDateAndAdmin(matchespredictions, response.matches, '1', response.users);
                                    }

                                    res.json(200, response);
                                } else {
                                    res.json(200, response);
                                }
                            });
                        });
                    } else {
                        res.json(200, response);
                    }
                });
            }
        });
    });

    // get user's prediction (main flow)
    app.get('/api/predictions', isLoggedIn, function (req, res) {
        var user_id = req.user._id;
        var userName = req.query.user;
        var isMatches = req.query.isMatches;
        user.findOne({_id: user_id}, function (error, aUser) {
            var response = {};
            if (error || !aUser) {
                errorWrapper(response, res);
            } else {
                response.status = 'OK';
                response.user = removeSensitiveInfo(aUser);

                // checking if we got other user to check for: userName
                if (typeof(userName) === 'undefined' || aUser.username === userName.toLowerCase()) {
                    // regular flow, get all matches:
                    if (typeof (isMatches) !== 'undefined' && isMatches === 'true') {
                        // get all user's matches predictions
                        matchespredictions.find({user_id: user_id}, function (err, matchesPredictionsForUser) {
                            if (!error && matchesPredictionsForUser) {
                                response.matchespredictions = matchesPredictionsForUser;

                                matches.find({}, function (err, matchesFound) {
                                    if (!error) {
                                        response.matches = sortByID(matchesFound, '1');
                                    }

                                    // correct user matches predictions
                                    if (matchesPredictionsForUser.length !== matchesFound.length) {
                                        storeMissingPredictions(user_id, matchesFound, '1');
                                        response.needRefresh = true;
                                        res.json(200, response);
                                    } else {
                                        res.json(200, response);
                                    }
                                });
                            }
                        });
                    } else {
                        // get all teams:
                        teams.find({}, function (err, teamsFounds) {
                            if (!error) {
                                response.teams = sortByID(teamsFounds, '2');

                                // get all user's teams predictions
                                teamspredictions.find({user_id: user_id}, function (err, teamsPredictionsForUser) {
                                    if (!error && teamsPredictionsForUser) {
                                        response.teamspredictions = teamsPredictionsForUser;
                                    }
                                    // correct user teams predictions
                                    if (teamsPredictionsForUser.length !== teamsFounds.length) {
                                        storeMissingPredictions(user_id, teamsFounds, '2');
                                        response.needRefresh = true;
                                        res.json(200, response);
                                    } else {
                                        res.json(200, response);
                                    }
                                });
                            }
                        });
                    }
                }
                // Other user flow
                else if (typeof(userName) !== 'undefined' && aUser.username !== userName.toLowerCase() && userName !== 'admin') {
                    user.findOne({username: userName.toLowerCase()}, function (error, otherUser) {
                        if (error || !otherUser) {
                            errorWrapper(response, res);
                        } else {
                            var otherUserID = otherUser._id;
                            // looking for other user details, only results until this deadline date.

                            if (typeof (isMatches) !== 'undefined' && isMatches === 'true') {
                                matches.find({}, function (err, matches) {
                                    if (!error) {
                                        response.matches = sortByID(matches, '1');

                                        // get all other user's matches predictions until this kickoff
                                        matchespredictions.find({user_id: otherUserID}, function (err, matchespredictions) {
                                            if (!error && matchespredictions) {
                                                if (isAdminUser(aUser)) {
                                                    response.matchespredictions = matchespredictions;
                                                } else {
                                                    response.matchespredictions = removeSensitiveInfoArrayWithDateAndAdmin(matchespredictions, response.matches, '1');
                                                }

                                                res.json(200, response);
                                            }
                                        });
                                    }
                                });
                            } else {
                                // get all teams:
                                teams.find({}, function (err, teams) {
                                        if (!error) {
                                            response.teams = sortByID(teams, '2');

                                            // get all user's teams predictions
                                            teamspredictions.find({user_id: otherUserID}, function (err, teamspredictions) {
                                                if (!error && teamspredictions) {

                                                    if (isAdminUser(aUser)) {
                                                        response.teamspredictions = teamspredictions;
                                                    } else {
                                                        response.teamspredictions = removeSensitiveInfoArrayWithDateAndAdmin(teamspredictions, response.teams, '2');
                                                    }

                                                    res.json(200, response);
                                                }
                                            });
                                        }
                                    }
                                );
                            }
                        }
                    });
                }
            }
        });
    });

    //
    function storeMissingPredictions(userId, arrOrig, type) {
        arrOrig.forEach(
            function (item) {
                if (type == '1') {
                    matchespredictions.findOne({
                        user_id: userId,
                        matchID: item.matchID
                    }, function (err, userMatchPrediction) {
                        if (!userMatchPrediction) {
                            var newPredict = new matchespredictions({
                                matchID: item.matchID,
                                user_id: userId
                            }).save(function (err) {
                            });
                        }

                    });

                } else {
                    teamspredictions.findOne({
                        user_id: userId,
                        teamID: item.teamID
                    }, function (err, userTeamPrediction) {
                        if (!userTeamPrediction) {
                            var newPredict = new teamspredictions({
                                teamID: item.teamID,
                                user_id: userId
                            }).save(function (err) {
                            });
                        }
                    });
                }
            }
        );
    }

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

    function removeSensitiveInfo(item) {
        item.__v = undefined;
        item.password = undefined;
        return item;
    }

    function removeSensitiveInfoArrayAndAdmin(arr) {
        if (arr) {
            var arr2 = [];
            arr.forEach(function (item) {
                if (!isAdminUser(item) && !isDemoUser(item)) {
                    arr2.push(removeSensitiveInfo(item));
                }
            })
        }
        return arr2;
    }

    function removeSensitiveInfoArray(arr) {
        if (arr) {
            arr.forEach(function (item) {
                removeSensitiveInfo(item);
            })
        }
        return arr;
    }

    function removeSensitiveInfoArrayWithDateAndAdmin(predictions, origList, type, users) {
        var filteredPredictions = [];

        if (predictions && origList) {
            if (type === '1') {
                var matchFilteredByDate = origList.filter(function (orgItem) {
                    return getIfTimePassed(orgItem.kickofftime);
                });
                if (matchFilteredByDate) {
                    filteredPredictions = predictions.filter(function (predictItem) {
                        for (var i = 0; i < matchFilteredByDate.length; i++) {
                            if (matchFilteredByDate[i].matchID === predictItem.matchID) {
                                return true;
                            }
                        }
                        return false;
                    });
                }
            } else {
                var teamFilteredByDate = origList.filter(function (orgItem) {
                    return getIfTimePassed(orgItem.deadline);
                });
                if (teamFilteredByDate) {
                    filteredPredictions = predictions.filter(function (predictItem) {
                        for (var i = 0; i < teamFilteredByDate.length; i++) {
                            if (teamFilteredByDate[i].teamID === predictItem.teamID) {
                                return true;
                            }
                        }
                        return false;
                    });
                }
            }
        }

        if (filteredPredictions.length > 0) {
            filteredPredictions = removeAdminFromPredictions(filteredPredictions, users);
        }

        return filteredPredictions;
    }

    function removeAdminFromPredictions(matches, users) {
        if (users) {
            // filter the admin user
            matches = matches.filter(function (predictItem) {
                for (var i = 0; i < users.length; i++) {
                    if (users[i]._id.toString() === predictItem.user_id) {
                        return true;
                    }
                }
                return false;
            });
        }
        return matches;
    }

    function getIfTimePassed(dateValue) {
        // If the kick off time is less than 1 hour than time is passed:
        var isTimePassed = dateValue.getTime() - (new Date()).getTime() < 3600000;
        return isTimePassed;
    }

    function sortByScore(arr) {
        var arrSorted = [];
        if (arr) {
            arrSorted = arr.slice(0);
            arrSorted.sort(function (a, b) {
                return b.score - a.score;
            });
        }
        return arrSorted;
    }

    function sortByID(arr, type) {
        var arrSorted = [];
        if (arr) {
            arrSorted = arr.slice(0);
            arrSorted.sort(function (a, b) {
                return type === '1' ? a.matchID - b.matchID : a.teamID - b.teamID;
            });
        }
        return arrSorted;
    }

    function errorWrapper(innerRes, res) {
        innerRes.status = 'ERROR';
        innerRes.message = 'Something Went Wrong (Server): ' + innerRes.message;
        res.json(200, innerRes);
    }

    function isAdminUser(user) {
        if (user.username === 'admin' && user.email === 'admin@admin') {
            return true;
        }
        return false;
    }

    function isDemoUser(user) {
        if (user.username === 'demo' && user.email === 'demo@demo') {
            return true;
        }
        return false;
    }
};