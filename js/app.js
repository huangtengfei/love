angular.module('myApp', ['ui.router', 'ngCookies', 'infinite-scroll']);

angular.module('myApp').config(config);

config.$inject = ['$urlRouterProvider', '$stateProvider'];

function config($urlRouterProvider, $stateProvider) {
	$urlRouterProvider.otherwise("/home");
	$stateProvider
		.state("Home", {
			url: "/home",
			templateUrl: "partials/home.html",
            controller: 'HomeController'
		})
		.state("My", {
			url: "/my",
			templateUrl: "partials/my.html",
            controller: 'MyController'
		})
}	
