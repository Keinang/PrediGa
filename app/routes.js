module.exports = function (app, passport) {
    var user = require('../app/models/user');
    var matches = require('../app/models/matches');
    var matchespredictions = require('../app/models/matchespredictions');
    var teams = require('../app/models/teams');
    var teamspredictions = require('../app/models/teamspredictions');
    var http = require('http');

    // Initial Data:
    app.get('/api/initial', isLoggedIn, function (req, res) {
        var user_id = req.user._id;
        user.findOne({_id: user_id}, function (error, user) {
            var response = {};
            if (!error) {
                // remove all:
                matches.remove().exec();
                teams.remove().exec();

                // insert matches data:
                new matches({ matchID: 1, team1: 'France', team2: 'Romania', kickofftime: new Date("2016-06-10T21:00:00Z")}).save(function (err) {});
                new matches({ matchID: 2, team1: 'Albania', team2: 'Switzerland', kickofftime: new Date("2016-06-11T15:00:00Z")}).save(function (err) {});
                new matches({ matchID: 3, team1: 'Wales', team2: 'Slovakia', kickofftime: new Date("2016-06-11T18:00:00Z")}).save(function (err) {});
                new matches({ matchID: 4, team1: 'England', team2: 'Russia', kickofftime: new Date("2016-06-11T21:00:00Z")}).save(function (err) {});
                new matches({ matchID: 5, team1: 'Turkey', team2: 'Croatia', kickofftime: new Date("2016-06-12T15:00:00Z")}).save(function (err) {});
                new matches({ matchID: 6, team1: 'Poland', team2: 'Northern Ireland', kickofftime: new Date("2016-06-120T18:00:00Z")}).save(function (err) {});
                new matches({ matchID: 7, team1: 'Germany', team2: 'Ukraine', kickofftime: new Date("2016-06-12T21:00:00Z")}).save(function (err) {});
                new matches({ matchID: 8, team1: 'Spain', team2: 'Czech Republic', kickofftime: new Date("2016-06-13T15:00:00Z")}).save(function (err) {});
                new matches({ matchID: 9, team1: 'Republic of Ireland', team2: 'Sweden', kickofftime: new Date("2016-06-13T18:00:00Z")}).save(function (err) {});
                new matches({ matchID: 10, team1: 'Belgium', team2: 'Italy', kickofftime: new Date("2016-06-13T21:00:00Z")}).save(function (err) {});
                new matches({ matchID: 11, team1: 'Austria', team2: 'Hungary', kickofftime: new Date("2016-06-14T18:00:00Z")}).save(function (err) {});
                new matches({ matchID: 12, team1: 'Portugal', team2: 'Iceland', kickofftime: new Date("2016-06-14T21:00:00Z")}).save(function (err) {});
                new matches({ matchID: 13, team1: 'Russia', team2: 'Slovakia', kickofftime: new Date("2016-06-15T15:00:00Z")}).save(function (err) {});
                new matches({ matchID: 14, team1: 'Romania', team2: 'Switzerland', kickofftime: new Date("2016-06-15T18:00:00Z")}).save(function (err) {});
                new matches({ matchID: 15, team1: 'France', team2: 'Albania', kickofftime: new Date("2016-06-15T21:00:00Z")}).save(function (err) {});
                new matches({ matchID: 16, team1: 'England', team2: 'Wales', kickofftime: new Date("2016-06-16T15:00:00Z")}).save(function (err) {});
                new matches({ matchID: 17, team1: 'Ukraine', team2: 'Northern Ireland', kickofftime: new Date("2016-06-16T18:00:00Z")}).save(function (err) {});
                new matches({ matchID: 18, team1: 'Germany', team2: 'Poland', kickofftime: new Date("2016-06-16T21:00:00Z")}).save(function (err) {});
                new matches({ matchID: 19, team1: 'Italy', team2: 'Sweden', kickofftime: new Date("2016-06-17T15:00:00Z")}).save(function (err) {});
                new matches({ matchID: 20, team1: 'Czech Republic', team2: 'Croatia', kickofftime: new Date("2016-06-17T18:00:00Z")}).save(function (err) {});
                new matches({ matchID: 21, team1: 'Spain', team2: 'Turkey', kickofftime: new Date("2016-06-17T21:00:00Z")}).save(function (err) {});
                new matches({ matchID: 22, team1: 'Belgium', team2: 'Republic of Ireland', kickofftime: new Date("2016-06-18T15:00:00Z")}).save(function (err) {});
                new matches({ matchID: 23, team1: 'Iceland', team2: 'Hungary', kickofftime: new Date("2016-06-18T18:00:00Z")}).save(function (err) {});
                new matches({ matchID: 24, team1: 'Portugal', team2: 'Austria', kickofftime: new Date("2016-06-18T21:00:00Z")}).save(function (err) {});
                new matches({ matchID: 25, team1: 'Romania', team2: 'Albania', kickofftime: new Date("2016-06-19T21:00:00Z")}).save(function (err) {});
                new matches({ matchID: 26, team1: 'Switzerland', team2: 'France', kickofftime: new Date("2016-06-19T21:00:00Z")}).save(function (err) {});
                new matches({ matchID: 27, team1: 'Russia', team2: 'Wales', kickofftime: new Date("2016-06-20T21:00:00Z")}).save(function (err) {});
                new matches({ matchID: 28, team1: 'Slovakia', team2: 'England', kickofftime: new Date("2016-06-20T21:00:00Z")}).save(function (err) {});
                new matches({ matchID: 29, team1: 'Ukraine', team2: 'Poland', kickofftime: new Date("2016-06-21T18:00:00Z")}).save(function (err) {});
                new matches({ matchID: 30, team1: 'Northern Ireland', team2: 'Germany', kickofftime: new Date("2016-06-21T18:00:00Z")}).save(function (err) {});
                new matches({ matchID: 31, team1: 'Czech Republic', team2: 'Turkey', kickofftime: new Date("2016-06-21T21:00:00Z")}).save(function (err) {});
                new matches({ matchID: 32, team1: 'Croatia', team2: 'Spain', kickofftime: new Date("2016-06-21T21:00:00Z")}).save(function (err) {});
                new matches({ matchID: 33, team1: 'Iceland', team2: 'Austria', kickofftime: new Date("2016-06-22T18:00:00Z")}).save(function (err) {});
                new matches({ matchID: 34, team1: 'Hungary', team2: 'Portugal', kickofftime: new Date("2016-06-22T18:00:00Z")}).save(function (err) {});
                new matches({ matchID: 35, team1: 'Italy', team2: 'Republic of Ireland', kickofftime: new Date("2016-06-22T21:00:00Z")}).save(function (err) {});
                new matches({ matchID: 36, team1: 'Sweden', team2: 'Belgium', kickofftime: new Date("2016-06-22T21:00:00Z")}).save(function (err) {});

                // playoffs
                new matches({ matchID: 37, team1: 'A2', team2: 'C2', kickofftime: new Date("2016-06-25T15:00:00Z")}).save(function (err) {});
                new matches({ matchID: 38, team1: 'B1', team2: 'ACD3', kickofftime: new Date("2016-06-25T18:00:00Z")}).save(function (err) {});
                new matches({ matchID: 39, team1: 'D1', team2: 'BEF3', kickofftime: new Date("2016-06-25T21:00:00Z")}).save(function (err) {});
                new matches({ matchID: 40, team1: 'A1', team2: 'CDE3', kickofftime: new Date("2016-06-26T15:00:00Z")}).save(function (err) {});
                new matches({ matchID: 41, team1: 'C1', team2: 'ABF3', kickofftime: new Date("2016-06-26T18:00:00Z")}).save(function (err) {});
                new matches({ matchID: 42, team1: 'F1', team2: 'E2', kickofftime: new Date("2016-06-26T21:00:00Z")}).save(function (err) {});
                new matches({ matchID: 43, team1: 'E1', team2: 'D2', kickofftime: new Date("2016-06-27T18:00:00Z")}).save(function (err) {});
                new matches({ matchID: 44, team1: 'B2', team2: 'F2', kickofftime: new Date("2016-06-27T21:00:00Z")}).save(function (err) {});

                // Q-Finals
                new matches({ matchID: 45, team1: 'W37', team2: 'W39', kickofftime: new Date("2016-06-30T21:00:00Z")}).save(function (err) {});
                new matches({ matchID: 46, team1: 'W38', team2: 'W42', kickofftime: new Date("2016-07-01T21:00:00Z")}).save(function (err) {});
                new matches({ matchID: 47, team1: 'W41', team2: 'W43', kickofftime: new Date("2016-07-02T21:00:00Z")}).save(function (err) {});
                new matches({ matchID: 48, team1: 'W40', team2: 'W44', kickofftime: new Date("2016-07-03T21:00:00Z")}).save(function (err) {});

                // S-Final
                new matches({ matchID: 49, team1: 'W45', team2: 'W46', kickofftime: new Date("2016-06-10T21:00:00Z")}).save(function (err) {});
                new matches({ matchID: 50, team1: 'W47', team2: 'W48', kickofftime: new Date("2016-07-07T21:00:00Z")}).save(function (err) {});
                // Final
                new matches({ matchID: 51, team1: 'W49', team2: 'W50', kickofftime: new Date("2016-07-10T21:00:00Z")}).save(function (err) {});

                // insert teams data:
                new teams({ teamID: 1, name: 'Champion', deadline: new Date("2016-06-10T21:00:00Z"), predictscore: 16}).save(function (err) {});
                new teams({ teamID: 2, name: 'Runner up', deadline: new Date("2016-06-10T21:00:00Z"), predictscore: 8}).save(function (err) {});
                new teams({ teamID: 3, name: 'A1', deadline: new Date("2016-06-10T21:00:00Z"), predictscore: 4}).save(function (err) {});
                new teams({ teamID: 4, name: 'A2', deadline: new Date("2016-06-10T21:00:00Z"), predictscore: 4}).save(function (err) {});
                new teams({ teamID: 5, name: 'B1', deadline: new Date("2016-06-10T21:00:00Z"), predictscore: 4}).save(function (err) {});
                new teams({ teamID: 6, name: 'B2', deadline: new Date("2016-06-10T21:00:00Z"), predictscore: 4}).save(function (err) {});
                new teams({ teamID: 7, name: 'C1', deadline: new Date("2016-06-10T21:00:00Z"), predictscore: 4}).save(function (err) {});
                new teams({ teamID: 8, name: 'C2', deadline: new Date("2016-06-10T21:00:00Z"), predictscore: 4}).save(function (err) {});
                new teams({ teamID: 9, name: 'D1', deadline: new Date("2016-06-10T21:00:00Z"), predictscore: 4}).save(function (err) {});
                new teams({ teamID: 10, name: 'D2', deadline: new Date("2016-06-10T21:00:00Z"), predictscore: 4}).save(function (err) {});
                new teams({ teamID: 11, name: 'E1', deadline: new Date("2016-06-10T21:00:00Z"), predictscore: 4}).save(function (err) {});
                new teams({ teamID: 12, name: 'E2', deadline: new Date("2016-06-10T21:00:00Z"), predictscore: 4}).save(function (err) {});
                new teams({ teamID: 13, name: 'E3', deadline: new Date("2016-06-10T21:00:00Z"), predictscore: 4}).save(function (err) {});

                // done:
                response.status = 'OK';
                response.user = removeSensitiveInfo(user);
                return res.json(200, response);
            } else {
                errorWrapper(response, res);
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
    app.get('/api/predictions', isLoggedIn, function (req, res) {
        var user_id = req.user._id;
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
                        response.matches = matches;

                        // get all user's matches predictions
                        matchespredictions.find({user_id: user_id}, function (err, matchespredictions) {
                            if (!error) {
                                response.matchespredictions = matchespredictions;

                                // get all teams:
                                teams.find({}, function (err, teams) {
                                    if (!error) {
                                        response.teams = teams;

                                        // get all user's teams predictions
                                        teamspredictions.find({user_id: user_id}, function (err, teamspredictions) {
                                            if (!error) {
                                                response.teamspredictions = teamspredictions;

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
    });


// =============================================================================
// Helpers =====================================================================
// =============================================================================

};
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

function errorWrapper(innerRes, res) {
    innerRes.status = 'ERROR';
    innerRes.message = 'Something Went Wrong';
    res.json(200, innerRes);
}