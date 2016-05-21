angular.module('summerproject', ['ngRoute', 'ngResource', 'appname.controllers', 'appname.services', 'ngAnimate', 'toastr']).config(['$routeProvider', function ($routeProvider) {
    'use strict';
    $routeProvider.when('/login', {
            title: 'Home',
            templateUrl: 'partials/login.html',
            controller: 'loginCtrl',
            resolve: {loginRedirect: loginRedirect}
        })
        .when('/signup', {
            title: 'Signup',
            templateUrl: 'partials/signup.html',
            controller: 'signupCtrl'
        })
        .when('/game', {
            title: 'Predictions',
            templateUrl: 'partials/game.html',
            controller: 'gameCtrl',
            resolve: {logincheck: checkLogin}
        })
        .when('/leaderboard', {
            title: 'Leaderboard',
            templateUrl: 'partials/leaderboard.html',
            controller: 'leaderboardCtrl',
            resolve: {logincheck: checkLogin}
        })
        .when('/help', {
            title: 'Help',
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


	