(function() {
    'use strict';
    testit.controller('MainController', ['$scope', '$http', function ($scope, $http) {
        $http.get('/personal/session').then(response => {
            $scope.session = response.data;
        });
    }]);
})();
