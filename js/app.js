angular.module('myApp', ['ngRoute', 'ngCookies', 'angular-md5', 'infinite-scroll', 'myApp.services', 'myApp.controllers', 'myApp.config']).
	config(['$routeProvider', function($routeProvider) {
		$routeProvider.
			when('/list', {
				templateUrl: 'partials/list.html',
				controller: 'PersonListCtrl'
			}).
			when('/my', {
				templateUrl: 'partials/my.html',
				controller: 'MyCtrl'
			}).
			// If invalid route, just redirect to the main list view
			otherwise({ redirectTo: '/list' });
}]);

