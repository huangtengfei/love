(function () {

    'use strict';

    angular.module('myApp', ['ui.router', 'ngCookies', 'infinite-scroll']);

    angular.module('myApp').config(config);

    config.$inject = ['$locationProvider', '$urlRouterProvider', '$stateProvider'];

    function config($locationProvider, $urlRouterProvider, $stateProvider) {

        //$locationProvider.html5Mode(true);

        $urlRouterProvider.otherwise("/home");

        $stateProvider
            .state("Home", {
                url: "/home",
                templateUrl: "partials/home.html",
                controller: 'HomeController',
                controllerAs: 'vm'
            })
            .state("My", {
                url: "/my",
                templateUrl: "partials/my.html",
                controller: 'MyController',
                controllerAs: 'vm'
            })
    }

})();
