testit.controller('TemplatesController', ['$scope', '$http', '$rootScope', 'Promise', 'errorMessage', 'successMessage', 'prompt', function ($scope, $http, $rootScope, Promise, errorMessage, successMessage, prompt) {
    'use strict';
    $scope.templates = {
        data: [],
        loadTemplates: Promise.coroutine(function*() {
            this.data = (yield $http.get("/template/all")).data;
        }),
        createTemplate: Promise.coroutine(function*() {
            prompt('Enter Template name').then(function(name) {
                $http.put('/template', {
                    name: name
                });
            });
        })
    };

    $scope.templates.loadTemplates();
}]);
