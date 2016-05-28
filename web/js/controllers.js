angular.module('appname.controllers', [])
    .controller('BaseCtrl', ['$scope', 'logoutService', function ($scope, logoutService) {
        $scope.logout = function () {
            logoutService.logout();
        };
    }])
    .controller('loginCtrl', ['$scope', 'logginService', 'logoutService', 'toastr', '$rootScope', '$location', function ($scope, logginService, logoutService, toastr, $rootScope, $location) {
        $scope.login = function () {
            if ($scope.username && $scope.password) {
                logginService.loggin($scope.username, $scope.password).then(function (result) {
                    if (result.status === 'OK') {
                        $location.path('/');
                        toastr.success('Logged In');
                    }
                });
            } else {
                toastr.error('Must provide a valid user name and password');
            }
        };
    }])
    .controller('signupCtrl', ['$scope', 'signupService', 'toastr', '$rootScope', '$location', function ($scope, signupService, toastr, $rootScope, $location) {
        $scope.signup = function () {
            if ($scope.username && $scope.email && $scope.password && $scope.access) {
                var data = {
                    email: $scope.email.trim().toLowerCase(),
                    password: $scope.password,
                    username: $scope.username.trim().toLowerCase(),
                    access: $scope.access
                };
                signupService.signup(data).then(function (result) {
                    if (result.status === 'OK') {
                        $rootScope.currentUser = result.user;
                        $location.path('/');
                    }
                });
            } else {
                toastr.error('All fields are required');
            }
        }
    }])
    .controller('helpCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {

    }])
    .controller('leaderboardCtrl', ['$scope', '$rootScope', 'leaderboardService', function ($scope, $rootScope, leaderboardService) {
        $scope.redirect = function (item) {
            window.location = '#/game/:' + item.username;
        };
        // Calling for data for the 1st time:
        leaderboardService.getAllUserList().then(function (result) {
            $scope.users = result.users;
        });
    }])
    .controller('simulatorTeamsCtrl', ['$scope', '$routeParams', 'simulatorTeamsService', function ($scope, $routeParams, simulatorTeamsService) {
        $scope.currentGame = typeof($routeParams.teamID) !== 'undefined' ? $routeParams.teamID.substr(1) : 1;

        $scope.changeSim = function () {
            window.location = '#/simulatorTeams/:' + $scope.currentGame;
        };
        $scope.getUserById = function (userId) {
            return getUserById(userId, $scope.users);
        };
        $scope.getNumber = function (num) {
            return getNumberGlobal(num);
        };
        $scope.getClass = function (userVal, actualVal) {
            return getClassGlobal(userVal, actualVal);
        };
        $scope.filterByType = function (type) {
            return filterByType(type);
        };
        $scope.update = function () {
            $scope.teamspredictions.forEach(function (team) {
                team.score = 0;
                if (typeof($scope.simGame._team) !== 'undefined' && team._team === $scope.simGame._team) {
                    team.score = $scope.teams[$scope.currentGame - 1].predictscore;
                }
                team.totalScore = $scope.getUserById(team.user_id).score + team.score;
            })
        };
        // Calling for data for the 1st time:
        simulatorTeamsService.teamSimulator($scope.currentGame).then(function (result) {
            $scope.teamspredictions = result.teamspredictions;
            $scope.users = result.users;
            $scope.teams = result.teams;
            $scope.simGame;
        });
    }])
    .controller('simulatorCtrl', ['$scope', '$routeParams', 'simulatorService', function ($scope, $routeParams, simulatorService) {
        $scope.currentGame = typeof($routeParams.matchID) !== 'undefined' ? $routeParams.matchID.substr(1) : 1;

        $scope.changeSim = function () {
            window.location = '#/simulator/:' + $scope.currentGame;
        };
        $scope.getUserById = function (userId) {
            return getUserById(userId, $scope.users);
        };

        $scope.getNumber = function (num) {
            return getNumberGlobal(num);
        };
        $scope.getClass = function (userVal, actualVal) {
            return getClassGlobal(userVal, actualVal);
        };
        $scope.update = function () {
            $scope.matchespredictions.forEach(function (match) {
                match.score = 0;
                if (match._winner === $scope.simGame._winner) {
                    match.score += 2;
                }
                if (match._team1score === $scope.simGame._team1score) {
                    match.score += 2;
                }
                if (match._team2score === $scope.simGame._team2score) {
                    match.score += 2;
                }
                if (match._goaldiff === $scope.simGame._goaldiff) {
                    match.score += 2;
                }
                if (match._firstscore === $scope.simGame._firstscore) {
                    match.score += 2;
                }
                match.totalScore = $scope.getUserById(match.user_id).score + match.score;
            })
        };
        // Calling for data for the 1st time:
        simulatorService.matchSimulator($scope.currentGame).then(function (result) {
            $scope.matchespredictions = result.matchespredictions;
            $scope.users = result.users;
            $scope.matches = result.matches;
            $scope.simGame;
        });
    }])
    .controller('gameCtrl', ['$routeParams', '$rootScope', '$scope', '$timeout', 'gameService', 'leaderboardService', 'toastr', function ($routeParams, $rootScope, $scope, $timeout, gameService, leaderboardService, toastr) {
        $scope.redirectSim = function (id, type) {
            if (type === 1 || type === '1') {
                window.location = '#/simulator/:' + id;
            } else {
                window.location = '#/simulatorTeams/:' + id;
            }
        };
        $scope.navigate = function (userName, type) {
            if (!userName || userName == null) {
                userName = $rootScope.currentUser.username;
            }
            if (type == 1) {
                window.location = '#/game/:' + userName;
            } else if (type == 2) {
                window.location = '#/teams/:' + userName;
            }
        };
        $scope.userName = typeof($routeParams.userName) !== 'undefined' && $rootScope.currentUser ? $routeParams.userName.substr(1) : $rootScope.currentUser.username;
        $scope.isAdmin = function () {
            return $rootScope.currentUser && $rootScope.currentUser && $rootScope.currentUser.isAdmin;
        };
        $scope.isSameUser = function () {
            return typeof($scope.userName) !== 'undefined' && $rootScope.currentUser && $scope.userName === $rootScope.currentUser.username;
        };

        $scope.formatDate = function (date) {
            var dateOut = new Date(date);
            return dateOut;
        };

        $scope.isDateOK = function (date) {
            // If the kick off time is less than 1 hour than time is passed:
            var isTimeOK = (new Date(date)).getTime() - (new Date()).getTime() > 3600000;
            return isTimeOK;
        };
        $scope.isDateOKNOT = function (date) {
            var val = $scope.isDateOK(date);
            return !val;
        };

        $scope.filterByType = function (type) {
            return filterByType(type);
        };

        $scope.getClass = function (userVal, actualVal) {
            return getClassGlobal(userVal, actualVal);
        };

        $scope.saveChanges = function (type) {
            if (type === 1) {
                gameService.saveChangesMatches($scope.matchespredictions).then(function (result) {
                    toastr.success('Successfully Saved');
                });
            } else {
                gameService.saveChangesTeams($scope.teamspredictions).then(function (result) {
                    toastr.success('Successfully Saved');
                });
            }
        };

        $scope.isMatches = window.location.href.indexOf("game") !== -1;
        gameService.getUserPredictions($scope.userName, $scope.isMatches).then(function (result) {
            $scope.user = result.user;

            if (result.needRefresh) {
                gameService.getUserPredictions($scope.userName, $scope.isMatches).then(function (result2) {
                    $scope.updateModel(result2);
                });
            } else {
                $scope.updateModel(result);
            }
        });

        leaderboardService.getAllUserList().then(function (result) {
            if (result) {
                $scope.users = result.users;
            }
        });

        $scope.updateModel = function (result) {
            if ($scope.isMatches) {
                $scope.matches = result.matches;
                $scope.matchespredictions = result.matchespredictions;
            } else {
                $scope.teams = result.teams;
                $scope.teamspredictions = result.teamspredictions;
            }
        };

        $scope.getNumber = function (num) {
            return getNumberGlobal(num);
        };
    }
    ]);

function getNumberGlobal(num) {
    var arr = [];
    for (var i = 0; i <= num; i++) {
        arr.push(i);
    }
    return arr;
}
function getClassGlobal(userVal, actualVal) {
    if (typeof(userVal) !== 'undefined' && userVal === actualVal) {
        return 'green';
    } else {
        return 'red';
    }
}
function getUserById(userId, users) {
    var res = [];
    if (userId) {
        users.forEach(function (user) {
            if (user._id === userId) {
                res.push(user);

            }
        });
    }
    if (res) {
        return res[0];
    } else {
        return null;
    }
}
var groupA = ['France', 'Romania', 'Albania', 'Switzerland'];
var groupB = ['England', 'Russia', 'Wales', 'Slovakia'];
var groupC = ['Germany', 'Ukraine', 'Poland', 'Northern Ireland'];
var groupD = ['Spain', 'Czech Republic', 'Turkey', 'Croatia'];
var groupE = ['Belgium', 'Italy', 'Republic of Ireland', 'Sweden'];
var groupF = ['Portugal', 'Iceland', 'Austria', 'Hungary'];
var allTeamsAB = $.merge(groupA, groupB);
var allTeamsCD = $.merge(groupC, groupD);
var allTeamsEF = $.merge(groupE, groupF);
var allTeamsABCD = $.merge(allTeamsAB, allTeamsCD);
var allTeams = $.merge(allTeamsABCD, allTeamsEF);

function filterByType(type) {
    if (type) {
        if (type.startsWith("Champion")) {
            return allTeams;
        }
        if (type.startsWith("A")) {
            return groupA;
        } else if (type.startsWith("B")) {
            return groupB;
        } else if (type.startsWith("C")) {
            return groupC;
        } else if (type.startsWith("D")) {
            return groupD;
        } else if (type.startsWith("E")) {
            return groupE;
        } else if (type.startsWith("F")) {
            return groupF;
        } else {
            return allTeams;
        }
    }

}