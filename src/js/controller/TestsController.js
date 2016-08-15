window.testit.controller('TestsController', ['$scope', '$controller', function ($scope, $controller) {
    'use strict';
    angular.extend(this, $controller('AbstractTestsController', {$scope: $scope}));
    $scope.openTests.route = '/test/all?status=OPEN';
    $scope.closedTests.route = '/test/all?status=CLOSED';

    $scope.openTests.load();
    $scope.closedTests.load();
}]);
