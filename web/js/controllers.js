angular.module('appname.controllers', ['ngAnimate'])
    .controller('BaseCtrl', ['$scope', 'logoutService', 'toastr', '$location', '$rootScope', function ($scope, logoutService, toastr, $location, $rootScope) {
        $scope.logout = function () {
            logoutService.logout();
        };
    }])
    .controller('loginCtrl', ['$scope', 'logginService', 'logoutService', 'toastr', '$rootScope', '$location', function ($scope, logginService, logoutService, toastr, $rootScope, $location) {
        $scope.login = function () {
            if ($scope.email && $scope.password) {
                logginService.loggin($scope.email, $scope.password).then(function (result) {
                    if (result.status === 'OK') {
                        //$rootScope.currentUser = result.user;
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
            if ($scope.username && $scope.email && $scope.password) {
                var data = {
                    email: $scope.email,
                    password: $scope.password,
                    username: $scope.username
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
        // Calling for data for the 1st time:
        leaderboardService.getAllUserList().then(function (result) {
            $scope.users = result.users;
        });
    }])
    .controller('gameCtrl', ['$scope', '$timeout', 'gameService', 'toastr', function ($scope, $timeout, gameService, toastr) {
        $scope.formatDate = function(date){
            var dateOut = new Date(date);
            return dateOut;
        };
        
        $scope.isDateOK = function (date) {
            return (new Date(date)).getTime() - (new Date()).getTime() > 0;
        };
        $scope.isDateOKNOT = function (date) {
            var val = $scope.isDateOK(date);
            return !val;
        };

        $scope.getClass = function (userVal, actualVal) {
            if (typeof(userVal) !== 'undefined' && userVal === actualVal) {
                return 'green';
            } else {
                return 'red';
            }
        };

        $scope.combine = function (list1, list2) {
            list1.forEach(function (entry) {
                // get all list2 values with the same id:
                var list2Filtered = list2.filter(function (item) {
                    return (item.matchID === entry.matchID && typeof (entry.matchID) !== 'undefined' )
                        || (item.teamID === entry.teamID && typeof (entry.teamID) !== 'undefined' );
                });
                // merge values
                entry = $.extend(entry, list2Filtered[0]);
            });
            return list1;
        };

        $scope.saveChanges = function () {
            gameService.saveChangesMatches($scope.matchesCombined).then(function (result) {
                gameService.saveChangesTeams($scope.teamsCombined).then(function (result) {
                    toastr.success('Successfully Saved');
                });
            });
        };

        $scope.filterTeamsNames = function (matches) {
            var uniqueNames = [];
            matches.forEach(function (entry) {
                if ($.inArray(entry.team1, uniqueNames) === -1) {
                    uniqueNames.push(entry.team1);
                }
                if ($.inArray(entry.team2, uniqueNames) === -1) {
                    uniqueNames.push(entry.team2);
                }
            });
            return uniqueNames;
        };

        gameService.getUserPredictions().then(function (result) {
            $scope.user = result.user;
            $scope.matchesCombined = $scope.combine(result.matches, result.matchespredictions);
            $scope.teamsCombined = $scope.combine(result.teams, result.teamspredictions);
            $scope.allTeams = $scope.filterTeamsNames(result.matches);
        });
    }]);