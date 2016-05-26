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
                response.message = error.message;
                return res.json(200, response);
            } else {
                initialData.insertData(matches, teams).then(function () {
                    updateUsersScores().then(function () {
                        console.log('Done updating initial data.');

                        // done:
                        response.status = 'OK';
                        response.user = removeSensitiveInfo(user);
                        return res.json(200, response);
                    });
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
            var filtered = [];

            var response = {};
            response.status = 'OK';

            // order by score:
            var byScore = users.slice(0);
            byScore.sort(function (a, b) {
                return b.score - a.score;
            });

            // filter admin + sensitive values:
            byScore.forEach(function (user) {
                if (!isAdminUser(user)) {
                    filtered.push(removeSensitiveInfo(user));
                }
            });

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

            users.forEach(function (user) {
                console.log('updateUsersTotalScores:' + user.username);

                // starting from 0:
                var totalScore = 0;

                matchespredictions.find({user_id: user._id}, function (err, matchespredictionsRows) {
                    if (matchespredictionsRows) {
                        matchespredictionsRows.forEach(function (matchespredictionsRow) {
                            totalScore += typeof(matchespredictionsRow.score) === 'number' ? matchespredictionsRow.score : 0;
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
        console.log('updateMatchPredictionsScores start');
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

    // admin page
    app.get('/api/predictions2', isLoggedIn, function (req, res) {
        var user_id = req.user._id;
        user.findOne({_id: user_id}, function (error, aUser) {
            var response = {};
            if (error || !aUser || !isAdminUser(aUser)) {
                errorWrapper(response, res);
            } else {
                response.status = 'OK';
                response.user = removeSensitiveInfo(aUser);

                matchespredictions.find({}, function (err, matchespredictions) {
                    if (!error && matchespredictions) {
                        response.matchespredictions = matchespredictions;

                        teamspredictions.find({}, function (err, teamspredictions) {
                            if (!error && teamspredictions) {
                                response.teamspredictions = teamspredictions;
                                res.send(200, response);
                            }
                        });
                    }
                });
            }
        });
    });

    // regular user flow
    // ~~~~~~~~~~~~~~~~~~~~~~~~~

    // update matches and teams:
    function updateMatchPredictionValues(matchesInput, user) {
        var deferred = Q.defer();

        if (matchesInput) {
            matchesInput.forEach(
                function (aMatch) {
                    console.log('updateMatchPredictionValues:' + aMatch.matchID);

                    // check if match is exist:
                    matches.findOne({matchID: aMatch.matchID}, function (error, dbMatch) {
                        if (!error && dbMatch) {
                            // if admin, we need to update the match itself:
                            var isAdmin = isAdminUser(user);

                            // check if we can update this item
                            var isTimePassed = dbMatch.kickofftime.getTime() - (new Date()).getTime() < 0;

                            if (!isTimePassed || isAdmin) {

                                // update match prediction with recent values
                                matchespredictions.findOne({
                                    matchID: aMatch.matchID,
                                    user_id: user._id
                                }, function (error, dbMatchPrediction) {
                                    //console.log('updateMatchPredictionValues (matchespredictions):' + aMatch.matchID);

                                    if (!error && dbMatchPrediction) {
                                        dbMatchPrediction._winner = isAdmin ? aMatch.winner : aMatch._winner;
                                        dbMatchPrediction._team1score = isAdmin ? aMatch.team1score : aMatch._team1score;
                                        dbMatchPrediction._team2score = isAdmin ? aMatch.team2score : aMatch._team2score;
                                        dbMatchPrediction._goaldiff = isAdmin ? aMatch.goaldiff : aMatch._goaldiff;
                                        dbMatchPrediction._firstscore = isAdmin ? aMatch.firstscore : aMatch._firstscore;
                                        dbMatchPrediction.save(function (err) {
                                            console.log('updateMatchPredictionValues (matchespredictions) save:' + aMatch.matchID);
                                        });
                                    } else if (aMatch.matchID !== null && typeof (aMatch.matchID) !== 'undefined') {
                                        new matchespredictions({
                                            matchID: aMatch.matchID,
                                            user_id: user._id,
                                            _winner: isAdmin ? aMatch.winner : aMatch._winner,
                                            _team1score: isAdmin ? aMatch.team1score : aMatch._team1score,
                                            _team2score: isAdmin ? aMatch.goaldiff : aMatch._goaldiff,
                                            _goaldiff: isAdmin ? aMatch.goaldiff : aMatch._goaldiff,
                                            _firstscore: isAdmin ? aMatch.firstscore : aMatch._firstscore
                                        }).save(function (err) {
                                            //console.log('updateMatchPredictionValues (matchespredictions) save:' + aMatch.matchID);
                                        });
                                    }
                                });
                            }

                            // update real matches
                            if (isAdmin) {
                                dbMatch.winner = aMatch.winner;
                                dbMatch.team1score = aMatch.team1score;
                                dbMatch.team2score = aMatch.team2score;
                                dbMatch.goaldiff = aMatch.goaldiff;
                                dbMatch.firstscore = aMatch.firstscore;
                                dbMatch.save(function (err) {
                                    //console.log('updateMatchPredictionValues (matchespredictions) save admin:' + aMatch.matchID);

                                });
                            }
                        } else {
                            console.log('updateMatchPredictionValues resolved');
                            deferred.resolve({});
                        }
                    });


                }, function () {
                    deferred.resolve();
                });
            // after the for each
            console.log('updateMatchPredictionValues resolved');
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
                        var isTimePassed = dbTeam.deadline.getTime() - (new Date()).getTime() < 0;

                        if (!isTimePassed || isAdmin) {
                            // update match prediction with recent values
                            teamspredictions.findOne({
                                teamID: aTeam.teamID,
                                user_id: user._id
                            }, function (error, dbTeamPrediction) {
                                if (!error && dbTeamPrediction) {
                                    dbTeamPrediction._team = isAdmin ? aTeam.team : aTeam._team;
                                    dbTeamPrediction.save();


                                } else if (aTeam._team !== null && typeof (aTeam._team) !== 'undefined') {
                                    new teamspredictions({
                                        teamID: aTeam.teamID,
                                        user_id: user._id,
                                        _team: isAdmin ? aTeam.team : aTeam._team
                                    }).save(function (err) {

                                    });
                                }
                            });
                        }

                        // update real teams
                        if (isAdmin) {
                            dbTeam.team = aTeam.team;

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

                // looking for other user details, only results until this deadline date.
                matches.find({matchID: matchId}, function (err, matches) {
                    if (!error) {
                        response.matches = removeSensitiveInfoArray(matches);

                        // get all other user's matches predictions until this kickoff
                        matchespredictions.find({matchID: matchId}, function (err, matchespredictions) {
                            if (!error && matchespredictions) {
                                response.matchespredictions = removeSensitiveInfoArrayWithDate(matchespredictions, response.matches, '1');

                                user.find({}, function (error, allUsers) {
                                    response.users = removeSensitiveInfoArrayAndAdmin(allUsers);
                                    res.json(200, response);
                                });

                            }
                        });
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
                        matches.find({}, function (err, matches) {
                            if (!error) {
                                response.matches = removeSensitiveInfoArray(matches);

                                // get all user's matches predictions
                                matchespredictions.find({user_id: user_id}, function (err, matchespredictions) {
                                    if (!error && matchespredictions) {

                                        response.matchespredictions = removeSensitiveInfoArray(matchespredictions);
                                        res.json(200, response);
                                    }
                                })
                            }
                        });
                    } else {
                        // get all teams:
                        teams.find({}, function (err, teams) {
                            if (!error) {
                                response.teams = removeSensitiveInfoArray(teams);

                                // get all user's teams predictions
                                teamspredictions.find({user_id: user_id}, function (err, teamspredictions) {
                                    if (!error && teamspredictions) {
                                        response.teamspredictions = removeSensitiveInfoArray(teamspredictions);
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
                                        response.matches = removeSensitiveInfoArray(matches);

                                        // get all other user's matches predictions until this kickoff
                                        matchespredictions.find({user_id: otherUserID}, function (err, matchespredictions) {
                                            if (!error && matchespredictions) {
                                                if (isAdminUser(aUser)) {
                                                    response.matchespredictions = matchespredictions;
                                                } else {
                                                    response.matchespredictions = removeSensitiveInfoArrayWithDate(matchespredictions, response.matches, '1');
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
                                            response.teams = removeSensitiveInfoArray(teams);

                                            // get all user's teams predictions
                                            teamspredictions.find({user_id: otherUserID}, function (err, teamspredictions) {
                                                if (!error && teamspredictions) {

                                                    if (isAdminUser(aUser)) {
                                                        response.teamspredictions = teamspredictions;
                                                    } else {
                                                        response.teamspredictions = removeSensitiveInfoArrayWithDate(teamspredictions, response.teams, '2');
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
                if (!isAdminUser(item)) {
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

    function removeSensitiveInfoArrayWithDate(predictions, origList, type) {
        var filteredPredictions = [];

        if (predictions && origList) {
            if (type === '1') {
                var matchFiltered = origList.filter(function (orgItem) {
                    return orgItem.kickofftime.getTime() - (new Date()).getTime() < 0;
                });
                if (matchFiltered) {

                    filteredPredictions = predictions.filter(function (predictItem) {
                        for (var i = 0; i < matchFiltered.length; i++) {
                            if (matchFiltered[i].matchID === predictItem.matchID) {
                                return true;
                            }
                        }
                        return false;
                    });
                }
            } else {
                var teamFiltered = origList.filter(function (orgItem) {
                    return orgItem.deadline.getTime() - (new Date()).getTime() < 0;
                });
                if (teamFiltered) {

                    filteredPredictions = predictions.filter(function (predictItem) {
                        for (var i = 0; i < teamFiltered.length; i++) {
                            if (teamFiltered[i].teamID === predictItem.teamID) {
                                return true;
                            }
                        }
                        return false;
                    });
                }
            }
        }

        return removeSensitiveInfoArray(filteredPredictions);
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
};