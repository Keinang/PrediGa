angular.module('appname.controllers', ['ngAnimate'])
    .controller('BaseCtrl', ['$scope', 'logoutService', 'toastr', '$location', '$rootScope', function ($scope, logoutService, toastr, $location, $rootScope) {
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
    .controller('leaderboardCtrl', ['$scope', '$rootScope', 'leaderboardService', '$location', function ($scope, $rootScope, leaderboardService, $location) {
        $scope.redirect = function (item) {
            window.location = '#/game/:' + item.username;
        };
        // Calling for data for the 1st time:
        leaderboardService.getAllUserList().then(function (result) {
            $scope.users = result.users;
        });
    }])
    .controller('simulatorCtrl', ['$routeParams', '$scope', '$rootScope', 'simulatorService', '$location', function ($routeParams, $scope, $rootScope, simulatorService, $location) {
        $scope.currentGame = typeof($routeParams.matchID) !== 'undefined' ? $routeParams.matchID.substr(1) : 1;

        $scope.changeSim = function () {
            window.location = '#/simulator/:' + $scope.currentGame;
        };
        // Calling for data for the 1st time:
        simulatorService.matchSimulator($scope.currentGame).then(function (result) {
            $scope.matchesCombined = combineSimulator(result.matchespredictions, result.users);
            $scope.match = result.matches[0]; // always one match
        });

        $scope.range1 = function (i) {
            return i ? range1(i - 1).concat(i) : []
        }
    }])
    .controller('adminCtrl', ['$scope', '$rootScope', 'adminService', function ($scope, $rootScope, $adminService) {
        $scope.groupByValue = function (items, groupByType) {
            var result = {};
            items.forEach(function (entry) {
                var itemAttributeVal = entry[groupByType];

                if (typeof(itemAttributeVal) !== 'undefined') {
                    var obj = result [itemAttributeVal];
                    if (typeof(obj) !== 'undefined') {
                        result [itemAttributeVal] = {
                            key: itemAttributeVal,
                            value: obj.value += 1
                        };
                    } else {
                        // first time:
                        result [itemAttributeVal] = {
                            key: itemAttributeVal,
                            value: 1
                        };
                    }

                }
            });

            return result;
        };
        $adminService.getPredictions().then(function (result) {
            $scope.user = result.user;
            if (result.matchespredictions) {

                $scope.matchespredictions = groupBy(result.matchespredictions, function (item) {
                    return [item.matchID];
                });
            }

            if (result.teamspredictions) {
                $scope.teamspredictions = groupBy(result.teamspredictions, function (item) {
                    return [item.teamID];
                });
            }
        })
    }])
    .controller('gameCtrl', ['$routeParams', '$rootScope', '$scope', '$timeout', 'gameService', 'toastr', function ($routeParams, $rootScope, $scope, $timeout, gameService, toastr) {
        $scope.redirectSim = function (matchID) {
            window.location = '#/simulator/:' + matchID;
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
            if (type.startsWith("Champion")) {
                return $scope.allTeams;
            }
            if (type.startsWith("A")) {
                return $scope.groupA;
            } else if (type.startsWith("B")) {
                return $scope.groupB;
            } else if (type.startsWith("C")) {
                return $scope.groupC;
            } else if (type.startsWith("D")) {
                return $scope.groupD;
            } else if (type.startsWith("E")) {
                return $scope.groupE;
            } else if (type.startsWith("F")) {
                return $scope.groupF;
            } else {
                return $scope.allTeams;
            }
        };

        $scope.getClass = function (userVal, actualVal) {
            if (typeof(userVal) !== 'undefined' && userVal === actualVal) {
                return 'green';
            } else {
                return 'red';
            }
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

        $scope.updateModel = function (result) {
            if ($scope.isMatches) {
                $scope.matches = result.matches;
                $scope.matchespredictions = result.matchespredictions;
            } else {
                $scope.teams = result.teams;
                $scope.teamspredictions = result.teamspredictions;

                $scope.groupA = ['France', 'Romania', 'Albania', 'Switzerland'];
                $scope.groupB = ['England', 'Russia', 'Wales', 'Slovakia'];
                $scope.groupC = ['Germany', 'Ukraine', 'Poland', 'Northern Ireland'];
                $scope.groupD = ['Spain', 'Czech Republic', 'Turkey', 'Croatia'];
                $scope.groupE = ['Belgium', 'Italy', 'Republic of Ireland', 'Sweden'];
                $scope.groupF = ['Portugal', 'Iceland', 'Austria', 'Hungary'];

                $scope.allTeamsAB = $.merge($scope.groupA, $scope.groupB);
                $scope.allTeamsCD = $.merge($scope.groupC, $scope.groupD);
                $scope.allTeamsEF = $.merge($scope.groupE, $scope.groupF);
                $scope.allTeamsABCD = $.merge($scope.allTeamsAB, $scope.allTeamsCD);
                $scope.allTeams = $.merge($scope.allTeamsABCD, $scope.allTeamsEF);
            }
        };

        $scope.getNumber = function (num) {
            var arr = [];
            for (var i = 0; i <= num; i++) {
                arr.push(i);
            }
            return arr;
        };
    }
    ]);

// TODO - remove all combines...
var combineSimulator = function (matches, users) {
    if (matches) {
        matches.forEach(function (entry) {
            if (entry) {
                // get all list2 values with the same id:
                var usersFiltered = users.filter(function (user) {
                    return (user._id === entry.user_id && typeof (entry.user_id) !== 'undefined' );
                });
                // merge values
                if (usersFiltered && usersFiltered[0]) {
                    entry.username = usersFiltered[0].username;
                }
            }
        });
    }

    return matches;
};

function groupBy(array, f) {
    var groups = {};
    array.forEach(function (o) {
        var group = JSON.stringify(f(o));
        groups[group] = groups[group] || [];
        groups[group].push(o);
    });
    return Object.keys(groups).map(function (group) {
        return groups[group];
    })
}