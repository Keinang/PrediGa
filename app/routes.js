module.exports = function (app, passport) {
    var user = require('../app/models/user');
    var http = require('http');

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
                response.user = user;
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
                response.user = user;

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
                response.user = user;
                res.json(200, response);
            } else {
                response.status = 'ERROR';
                response.message = 'Something Went Wrong';
                res.json(200, response);
            }
        });
    });

    app.get('/api/users', function (req, res) {
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

};

// =============================================================================
// Helpers =====================================================================
// =============================================================================

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.send('you are not logged in');
    }
}

function removeSensitiveInfo(user) {
    user.__v = undefined;
    user._id = undefined;
    user.password = undefined;
    return user;
}