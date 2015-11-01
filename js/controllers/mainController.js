(function () {

    'use strict';

    angular
        .module('myApp')
        .controller('MainController', MainController);

    MainController.$inject = ['$scope', '$cookieStore', '$location', 'DialogService'];

    function MainController($scope, $cookieStore, $location, DialogService) {
        $scope.toMy = function () {
            if (!$cookieStore.get('jobno')) {
                DialogService.modal({
                    key: "app.loginDialog",
                    url: "partials/login-dialog.html",
                    accept: function (result) {
                    },
                    refuse: function () {
                    }
                });
            } else {
                $location.path('my');
            }
        }
    }

})();