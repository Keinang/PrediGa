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
    .controller('leaderboardCtrl', ['$scope', '$rootScope', 'leaderboardService', 'toastr', function ($scope, $rootScope, leaderboardService, toastr) {
        // Calling for data for the 1st time:
        leaderboardService.getAllUserList().then(function (result) {
            $scope.users = result.users;
        });
    }])
    .controller('gameCtrl', ['$scope', '$timeout', 'logoutService', 'gameService', 'toastr', '$rootScope', function ($scope, $timeout, logoutService, gameService, toastr, $rootScope) {
        $scope.combine = function(list1, list2){
            list1.forEach(function(entry) {
                // get all list2 values with the same id:
                // merge values
            });
            return list1;
        };

        gameService.getUserPredictions().then(function (result) {
            $scope.user = result.user;
            $scope.matchesCombined = $scope.combine(result.matches, result.matchespredictions);
            $scope.teamsCombined = $scope.combine(result.teams, result.teamspredictions);
        });
    }]);