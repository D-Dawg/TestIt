window.testit.config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
        'use strict';

        $urlRouterProvider.otherwise('/applications');


        $stateProvider
            .state('applications', {
                url: '/applications',
                views: {
                    nav: {templateUrl: '/templates/nav.html'},
                    main: {templateUrl: '/templates/views/applications.html', controller: 'ApplicationsController'}
                }
            })
            .state('application', {
                url: '/application/:id',
                views: {
                    nav: {templateUrl: '/templates/nav.html'},
                    main: {templateUrl: '/templates/views/application.html', controller: 'ApplicationController'}
                }
            }).state('my-tests', {
                url: '/my-tests',
                views: {
                    nav: {templateUrl: '/templates/nav.html'},
                    main: {templateUrl: '/templates/views/my-tests.html', controller: 'MyTestsController'}
                }
            }).state('tests', {
                url: '/tests',
                views: {
                    nav: {templateUrl: '/templates/nav.html'},
                    main: {templateUrl: '/templates/views/tests.html'}
                }
            }).state('test', {
                url: '/test/:id',
                views: {
                    nav: {templateUrl: '/templates/nav.html'},
                    main: {templateUrl: '/templates/views/test.html', controller: 'TestController'}
                }
            }).state('account', {
                url: '/account',
                views: {
                    nav: {templateUrl: '/templates/nav.html'},
                    main: {templateUrl: '/templates/views/account.html', controller: 'AccountController'}
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
