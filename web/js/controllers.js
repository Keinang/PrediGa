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
                        $rootScope.currentUser = result.user;
                        $location.path('/profile');
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
                        $location.path('/profile');
                    }
                });
            } else {
                toastr.error('All fields are required');
            }
        }

    }])
    .controller('profileCtrl', ['$scope', 'profileService', '$rootScope', function ($scope, profileService, $rootScope) {
        $scope.getuserinfo = function () {
            profileService.getUserInfo().then(function (result) {
                if (result.status === 'OK') {
                    $scope.user = result.user;
                }
            });
        };
        $scope.getuserinfo();

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
        // when page is refreshed, init timer + questions
        $scope.getUserInfo = function (reRenderDigits) {
            gameService.getUserInfo().then(function (result) {
                $scope.user = result.user;
                setUiHints($scope);
                if (result.status === 'OK') {
                    // Send usage analytics:
                    ga('send', 'pageview', '/game' + result.user.game.level + '.html');

                    // Reset answer:
                    var answerInputDiv = angular.element(document.querySelector('#answerInput'));
                    answerInputDiv[0].value = '';

                    // Re-render time:
                    if (reRenderDigits) {
                        result.user.game.timeEnd = new Date(result.user.game.timeEnd);
                        showDigits(result.user.game.timeEnd, toastr);
                    }
                }
            });
        };

        // On user submit answer:
        $scope.submitAnswer = function () {
            var answerInputDiv = angular.element(document.querySelector('#answerInput'));
            var data = {
                answer: answerInputDiv[0].value
            };
            gameService.submitAnswer(data).then(function (result) {
                if (result.status === 'OK') {
                    toastr.success(result.message);
                    $scope.getUserInfo(false); // ==> getUserInfo will manage all
                }
                else {
                    $scope.wrongAnswer = true;
                    $timeout(function () {
                        $scope.wrongAnswer = false;
                    }, 2000);
                }
            });
        };

        // On user getting hint:
        $scope.getHint = function () {
            gameService.getHint().then(function (result) {
                $scope.user = result.user;
                setUiHints($scope);
            })
        };

        $scope.transfer = function () {
            var myAccountLabel = angular.element(document.querySelector('#accountNumber'));
            var myAmountInput = angular.element(document.querySelector('#amount'));
            if (myAccountLabel[0].textContent) {
                var data = {
                    accountNumber: myAccountLabel[0].textContent,
                    amount: myAmountInput[0].value
                };
                gameService.transfer(data).then(function (result) {
                    if (result.status === 'OK') {

                        //toastr.success('Great Success! Check response for confirmation key to proceed');
                        toastr.success(result.message);
                        setConfirmationToken($scope, true, result.confKey);
                    }
                    else if (result.status === 'idle') {
                        toastr.success('Money successfully transferred!');
                    }
                });
            } else {
                toastr.error('Please provide amount to transfer');
            }
        };

        $scope.showModalCh2 = false;
        $scope.toggleRecoveryQuestion = function () {
            $scope.showModalCh2 = !$scope.showModalCh2;
        };

        $scope.showPicture = function () {
            $scope.ShowPic = true;
            $timeout(function () {
                $scope.ShowPic = false;
            }, 2000);
        };
        // logout when time is up
        $scope.checkUserTime = function () {
            if ($scope.user.game.timeEnd !== undefined && new Date($scope.user.game.timeEnd) - new Date() < 0) {
                // times up -> logout.
                logoutService.logout();
                return false;
            }
            return true;
        };

        $scope.startCheckTime = function () {
            setTimeout(function () {
                if ($scope.checkUserTime()) {
                    $scope.startCheckTime();
                }

            }, 5000);
        };

        $scope.startCheckTime();
        document.location.href = "#"; // scroll up
        $scope.getUserInfo(true);

        $scope.onToggleButtonCH1 = function () {
            $("#toggleButtonCH1").css({
                left: (Math.random() * 400) + "px",
                top: (Math.random() * 400) + "px"
            });
        }
    }]);

function showDigits(userTimeEnd, toastr) {
    var digits = angular.element(document.querySelector('.digits'));

    digits.countdown({
        image: "img/digits.png",
        format: "mm:ss",
        endTime: userTimeEnd,
        continuous: false,
        timerEnd: function () {
            toastr.error('Time is up');
        }
    });
}

function setUiHints(scope) {
    scope.isHintDisabled = !scope.user.game.hasMoreHints;
}

function setConfirmationToken(scope, confirmation, confK) {
    scope.confirmationToken = true;
    scope.confKey = confK;
}