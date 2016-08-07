window.testit.controller('TemplatesController', ['$scope', '$http', '$rootScope', 'Promise', 'errorMessage', 'successMessage', 'prompt', function ($scope, $http, $rootScope, Promise, errorMessage, successMessage, prompt) {
    'use strict';
    $scope.templates = {
        loading: true,
        data: [],
        loadTemplates: Promise.coroutine(function*() {
            this.data = (yield $http.get('/template/all')).data;
            this.loading = false;
        }),
        createTemplate: function() {
            let templates = this.data;
            prompt('Enter Template name').then(function(name) {
                $http.put('/template', {
                    name: name
                }).success(function(data) {
                    templates.unshift(data);
                });
            });
        }
    };

    $scope.templates.loadTemplates();
}]);
