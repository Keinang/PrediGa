module.exports = function (app, passport) {
    var initialData = require('../app/initialData');
    var user = require('../app/models/user');
    var matches = require('../app/models/matches');
    var matchespredictions = require('../app/models/matchespredictions');
    var teams = require('../app/models/teams');
    var teamspredictions = require('../app/models/teamspredictions');
    var http = require('http');
    var Q = require('q');

    var initialDataService = function initialDataService(){
        initialData.insertData(matches, teams);
        updateUsersScores();

        console.log('Done updating initial data.');
    };

    // Calling this function when server start:
    initialDataService();

    // Initial Data REST:
    app.get('/api/initial', isLoggedIn, function (req, res) {
        var user_id = req.user._id;
        user.findOne({_id: user_id}, function (error, user) {
            var response = {};
            if (error) {
                response.status = 'ERROR';
                response.message = error.message;
                return res.json(200, response);
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
        passport.authenticate('local-signup', function (err, user, message) {
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
                if (!isAdminUser(user)){
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
    function updateUsersScores() {
        // update user matches:
        matchespredictions.find({}, function (err, matchespredictionsRows) {
            matchespredictionsRows.forEach(function (matchespredictionsRow) {
                // find related match:
                matches.find({matchID: matchespredictionsRow.matchID}, function (err, matchRelated) {
                    matchespredictionsRow.score = 0;
                    if (matchRelated[0]){
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
                    if (typeof(teamRelated[0]) !== 'undefined' && typeof(teamRelated[0].team) !== 'undefined' && teamRelated[0].team === teamspredictionsRow._team) {
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

    function updateMatchPrediction(matchesInput, user) {
        var deferred = Q.defer();

        if (matchesInput) {
            matchesInput.forEach(function (aMatch) {

                // check if match is exist:
                matches.find({matchID: aMatch.matchID}).limit(1).exec(function (error, dbMatch) {
                    if (!error && dbMatch[0]) {
                        // if admin, we need to update the match itself:
                        var isAdmin = isAdminUser(user);

                        // check if we can update this item
                        var isTimePassed = dbMatch[0].kickofftime.getTime() - (new Date()).getTime() < 0 || !isAdmin;

                        if (!isTimePassed) {

                            // update match prediction with recent values
                            matchespredictions.find({
                                matchID: aMatch.matchID,
                                user_id: user._id
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
                                        user_id: user._id,
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

                        // update real matches
                        if (isAdmin) {
                            dbMatch[0].winner = aMatch.winner;
                            dbMatch[0].team1score = aMatch.team1score;
                            dbMatch[0].team2score = aMatch.team2score;
                            dbMatch[0].goaldiff = aMatch.goaldiff;
                            dbMatch[0].firstscore = aMatch.firstscore;
                            dbMatch[0].save(function () {
                                updateUsersScores();
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

    function updateTeamPrediction(teamsInput, user) {
        var deferred = Q.defer();
        if (teamsInput) {
            teamsInput.forEach(function (aTeam) {
                // check if team is exist:
                teams.find({teamID: aTeam.teamID}).limit(1).exec(function (error, dbTeam) {
                    if (!error && dbTeam[0]) {

                        // if admin, we need to update the match itself:
                        var isAdmin = isAdminUser(user);

                        // check if we can update this item
                        var isTimePassed = dbTeam[0].deadline.getTime() - (new Date()).getTime() < 0 || !isAdmin;

                        if (!isTimePassed) {
                            // update match prediction with recent values
                            teamspredictions.find({
                                teamID: aTeam.teamID,
                                user_id: user._id
                            }).limit(1).exec(function (error, dbTeamPrediction) {
                                if (!error && dbTeamPrediction[0] !== null && typeof (dbTeamPrediction[0]) !== 'undefined') {
                                    dbTeamPrediction[0]._team = aTeam._team;
                                    dbTeamPrediction[0].save();


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
                            dbTeam[0].dbTeam = aTeam.dbTeam;

                            dbTeam[0].save(function () {
                                updateUsersScores();
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
                updateMatchPrediction(req.body.matches, user).then(
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
                updateTeamPrediction(req.body.teams, user).then(
                    res.send(200, response)
                );
            }
        });
    });

    function getAllUserPrediction(user_id, userName, res) {
        user.findOne({_id: user_id}, function (error, aUser) {
            var response = {};
            if (error || !aUser) {
                errorWrapper(response, res);
            } else {
                response.status = 'OK';
                response.user = removeSensitiveInfo(aUser);

                // checking if we got other user to check for: userName
                if (typeof(userName) === 'undefined' || aUser.username === userName) {
                    // regular flow, get all matches:
                    matches.find({}, function (err, matches) {
                        if (!error) {
                            response.matches = sortByID(removeSensitiveInfoArray(matches), '1');

                            // get all user's matches predictions
                            matchespredictions.find({user_id: user_id}, function (err, matchespredictions) {
                                if (!error && matchespredictions) {

                                    response.matchespredictions = sortByID(removeSensitiveInfoArray(matchespredictions), '1');
                                    // get all teams:
                                    teams.find({}, function (err, teams) {
                                        if (!error) {
                                            response.teams = sortByID(removeSensitiveInfoArray(teams), '2');

                                            // get all user's teams predictions
                                            teamspredictions.find({user_id: user_id}, function (err, teamspredictions) {
                                                if (!error && teamspredictions) {
                                                    response.teamspredictions = sortByID(removeSensitiveInfoArray(teamspredictions), '2');

                                                    res.json(200, response);
                                                }
                                            });
                                        }
                                    });
                                }
                            })
                        }
                    });
                }
                // Other user flow
                else if (typeof(userName) !== 'undefined' && user.username !== userName) {
                    user.findOne({username: userName}, function (error, aUser) {
                        if (error || !aUser || isAdminUser(aUser)) {
                            errorWrapper(response, res);
                        } else {
                            var otherUserID = aUser._id;
                            // looking for other user details, only results until this deadline date.
                            matches.find({}, function (err, matches) {
                                if (!error) {
                                    response.matches = sortByID(removeSensitiveInfoArray(matches), '1');

                                    // get all other user's matches predictions until this kickoff
                                    matchespredictions.find({user_id: otherUserID}, function (err, matchespredictions) {
                                        if (!error && matchespredictions) {
                                            response.matchespredictions = sortByID(removeSensitiveInfoArrayWithDate(matchespredictions, response.matches, '1'), '1');

                                            // get all teams:
                                            teams.find({}, function (err, teams) {
                                                    if (!error) {
                                                        response.teams = sortByID(removeSensitiveInfoArray(teams), '2');

                                                        // get all user's teams predictions
                                                        teamspredictions.find({user_id: otherUserID}, function (err, teamspredictions) {
                                                            if (!error && teamspredictions) {
                                                                response.teamspredictions = sortByID(removeSensitiveInfoArrayWithDate(teamspredictions, response.teams, '2'), '2');
                                                                res.json(200, response);
                                                            }
                                                        });
                                                    }
                                                }
                                            );
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            }
        });

    };

    app.get('/api/predictions', isLoggedIn, function (req, res) {
        getAllUserPrediction(req.user._id, req.query.user, res);
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
        item._id = undefined;
        item.password = undefined;
        item.user_id = undefined;
        return item;
    }

    function removeSensitiveInfoArray(arr) {
        if (arr) {
            arr.forEach(function (item) {
                removeSensitiveInfo(item);
            })
        }
        return arr;
    }

    function removeSensitiveInfoArrayWithDate(matchespredictions, origList, type) {
        var filteredPredictions = [];

        if (matchespredictions && origList) {
            if (type === '1') {
                var matchFiltered = origList.filter(function (orgItem) {
                    return orgItem.kickofftime.getTime() - (new Date()).getTime() < 0;
                });
                if (matchFiltered) {

                    filteredPredictions = matchespredictions.filter(function (predictItem) {
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

                    filteredPredictions = matchespredictions.filter(function (predictItem) {
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