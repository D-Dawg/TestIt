window.testit.controller('AbstractTestsController', ['$scope', '$http', '$rootScope', 'Promise', '$controller', function ($scope, $http, $rootScope, Promise, $controller) {
    'use strict';
    $scope.openTests = {
        route: null,
        loading: false,
        data: null,
        load: Promise.coroutine(function*() {
            if (!this.route) {
                throw new Error('route not set');
            }
            this.loading = true;
            let response = yield $http.get(this.route);
            this.data = response.data;
            this.loading = false;
            $scope.$apply();
        })
    };

    $scope.closedTests = {
        route: null,
        loading: false,
        data: null,
        load: Promise.coroutine(function*() {
            if (!this.route) {
                throw new Error('route not set');
            }
            this.loading = true;
            let response = yield $http.get(this.route);
            this.data = response.data;
            this.loading = false;
            $scope.$apply();
        })
    };
}]);
