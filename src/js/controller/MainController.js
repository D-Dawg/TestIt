testit.controller('MainController', ['$scope', '$http', function ($scope, $http) {
    'use strict';

    $http.get('/personal/session').then(response => {
        $scope.me = response.data.me;

        $scope.permissions = {};
        for(let i = 0; i < response.data.permissions.length; i++) {
            $scope.permissions[response.data.permissions[i]] = response.data.me.permissions.indexOf(response.data.permissions[i]) > -1;
        }
    });
}]);
