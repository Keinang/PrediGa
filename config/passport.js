// load all the things we need
var LocalStrategy = require('passport-local').Strategy;

// load up the user model
var User = require('../app/models/user');

module.exports = function (passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        if (user && user.id) {
            done(null, user.id);
        } else {
            done(null, 'Error');
        }

    });

    // used to deserialize the user
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            if (typeof (user) !== 'undefined') {
                done(err, user);
            } else {
                done(err, 'Error');
            }
        });
    });

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    passport.use('local-login', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
        },
        function (req, username, password, done) {
            if (username) {
                username = username.trim().toLowerCase();
                // asynchronous
                process.nextTick(function () {
                    User.findOne({'username': username}, function (err, user) {
                        // if there are any errors, return the error
                        if (err) {
                            return done(err);
                        }
                        // if no user is found, return the message
                        if (!user) {
                            return done(null, false, 'No user found.');
                        }
                        if (!user.validPassword(password)) {
                            return done(null, false, 'Oops! Wrong password.');
                        }
                        // all is well, return user
                        else {
                            return done(null, user);
                        }
                    });
                });
            }
        }));

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    passport.use('local-signup', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
        },
        function (req, email, password, done) {
            if (email) {
                email = email.trim().toLowerCase();

                var accessToken = req.body ? req.body.access : null;
                if (!accessToken || accessToken !== 'aAbBcCdDeEfF') {
                    return done(null, false, 'Wrong access token, contact the administrator.');
                }

                // asynchronous
                process.nextTick(function () {
                    // if the user is not already logged in:
                    if (!req.user) {
                        var username = req.body ? req.body.username.trim().toLowerCase() : null;

                        User.findOne({'username': username}, function (err, aUser) {
                            // if there are any errors, return the error
                            if (err) {
                                return done(err);
                            }
                            // check to see if there is already a user with that username
                            if (aUser) {
                                return done(null, false, 'That username is already taken.');
                            } else {
                                User.findOne({'email': email}, function (err, user) {
                                    // if there are any errors, return the error
                                    if (err) {
                                        return done(err);
                                    }
                                    // check to see if there is already a user with that email
                                    if (user) {
                                        return done(null, false, 'That email is already taken.');
                                    } else {

                                        // create the user
                                        var newUser = new User();

                                        newUser.email = email;
                                        newUser.password = newUser.generateHash(password);
                                        newUser.username = req.body.username.trim().toLowerCase();

                                        newUser.save(function (err) {
                                            if (err) {
                                                return done(err, false, 'Something Went Wrong (Passport)');
                                            }

                                            return done(null, newUser);
                                        });
                                    }

                                });
                            }
                        });
                    } else {
                        // user is logged in and already has a local account. Ignore signup. (You should log out before trying to create a new account, user!)
                        return done(null, req.user);
                    }

                });
            }
        }));
};
