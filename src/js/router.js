testit.config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
        'use strict';

        $urlRouterProvider.otherwise('/templates');


        $stateProvider
        .state('templates', {
                url: '/templates',
                views: {
                    nav: {templateUrl: '/templates/nav.html'},
                    main: {templateUrl: '/templates/views/templates.html'}
                }
            }).state('account', {
                url: '/account',
                views: {
                    nav: {templateUrl: '/templates/nav.html'},
                    main: {templateUrl: '/templates/views/account.html'}
                }
            }).state('administration', {
                url: '/administration',
                abstract: true,
                views: {
                    nav: {templateUrl: '/templates/nav.html'},
                    main: {templateUrl: '/templates/views/administration.html'}
                }
            }).state('administration.users', {
                url: '/users',
                templateUrl: '/templates/views/administration/users.html'
            }).state('administration.settings', {
                url: '/settings',
                templateUrl: '/templates/views/administration/settings.html'
            });
    }]);