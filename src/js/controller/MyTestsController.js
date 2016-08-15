window.testit.controller('MyTestsController', ['$scope', '$http', '$rootScope', 'Promise', '$controller', function ($scope, $http, $rootScope, Promise, $controller) {
    'use strict';
    angular.extend(this, $controller('AbstractTestsController', {$scope: $scope}));
    $scope.openTests.route = '/test/assignedToMe?status=OPEN';
    $scope.closedTests.route = '/test/assignedToMe?status=CLOSED';

    $scope.openTests.load();
    $scope.closedTests.load();
}]);
