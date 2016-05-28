angular.module('summerproject', ['ngRoute', 'ngResource', 'appname.controllers', 'appname.services', 'ngAnimate', 'toastr', 'angular-loading-bar'])
    .config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
        cfpLoadingBarProvider.includeSpinner = true;
        cfpLoadingBarProvider.includeBar = true;
    }])
    .config(['$routeProvider', function ($routeProvider) {
        'use strict';

        $routeProvider
            .when('/login', {
                templateUrl: 'partials/login.html',
                controller: 'loginCtrl',
                resolve: {loginRedirect: loginRedirect}
            })
            .when('/signup', {
                templateUrl: 'partials/signup.html',
                controller: 'signupCtrl'
            })
            .when('/game', {
                templateUrl: 'partials/game.html',
                controller: 'gameCtrl',
                resolve: {logincheck: checkLogin}
            })
            .when('/game/:userName', {
                templateUrl: 'partials/game.html',
                controller: 'gameCtrl',
                resolve: {logincheck: checkLogin}
            })
            .when('/simulator', {
                templateUrl: 'partials/simulator.html',
                controller: 'simulatorCtrl',
                resolve: {logincheck: checkLogin}
            })
            .when('/simulator/:matchID', {
                templateUrl: 'partials/simulator.html',
                controller: 'simulatorCtrl',
                resolve: {logincheck: checkLogin}
            })
            .when('/teams', {
                templateUrl: 'partials/teams.html',
                controller: 'gameCtrl',
                resolve: {logincheck: checkLogin}
            })
            .when('/teams/:userName', {
                templateUrl: 'partials/teams.html',
                controller: 'gameCtrl',
                resolve: {logincheck: checkLogin}
            })
            .when('/leaderboard', {
                templateUrl: 'partials/leaderboard.html',
                controller: 'leaderboardCtrl',
                resolve: {logincheck: checkLogin}
            })
            .when('/help', {
                templateUrl: 'partials/help.html',
                controller: 'helpCtrl',
                resolve: {logincheck: checkLogin}
            })
            .otherwise({redirectTo: '/login'});
    }]).run(['$rootScope', '$q', '$http', function ($rootScope, $q, $http) {

    var loginSetIntialData = function () {

        $http.get('/api/loggedin').success(function (user) {
            if (user != 0) {
                $rootScope.currentUser = user;
            }
            //User is not Authenticated
            else {
                $rootScope.currentUser = undefined;
            }
        }).error(function (result) {
            $rootScope.currentUser = undefined;
        });
    }();

}]);

var checkLogin = function ($q, $http, $location, $rootScope, toastr) {
    var deffered = $q.defer();

    $http.get('/api/loggedin').success(function (user) {
        // User is authenticated
        if (user != 0) {
            $rootScope.currentUser = user;
            deffered.resolve();
        }
        // User is not Authenticated
        else {
            $rootScope.currentUser = undefined;
            deffered.reject();
            $location.url('/login');
            toastr.error('Please Login First');
        }
    }).error(function (result) {
        $location.url('/login');
    });

};

var loginRedirect = function ($q, $http, $location, $rootScope) {
    var deffered = $q.defer();
    $http.get('/api/loggedin').success(function (user) {
        //User is authenticated
        if (user != 0) {
            $rootScope.currentUser = user;
            deffered.reject();
            $location.url('/game');
        }
        //User is not Authenticated
        else {
            $rootScope.currentUser = undefined;
            deffered.resolve();
        }
    })
};


	