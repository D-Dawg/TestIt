window.testit.controller('ApplicationsController', ['$scope', '$http', '$rootScope', 'Promise', 'errorMessage', 'successMessage', 'prompt', function ($scope, $http, $rootScope, Promise, errorMessage, successMessage, prompt) {
    'use strict';
    $scope.applications = {
        loading: true,
        data: [],
        loadApplications: Promise.coroutine(function*() {
            this.data = (yield $http.get('/application/all')).data;
            this.loading = false;
        }),
        createApplication: function() {
            let applications = this.data;
            prompt('Enter Application name').then(function(name) {
                $http.put('/application', {
                    name: name
                }).success(function(data) {
                    applications.unshift(data);
                });
            });
        }
    };

    $scope.applications.loadApplications();
}]);
