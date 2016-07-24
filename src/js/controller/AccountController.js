testit.controller('AccountController',
    ['$scope', '$http', '$rootScope', 'Promise', 'errorMessage', 'successMessage',
        function ($scope, $http, $rootScope, Promise, errorMessage, successMessage) {
    'use strict';
    $scope.changePassword = {
        oldPassword: '',
        newPassword1: '',
        newPassword2: '',
        loading: false,
        reset: function() {
            this.oldPassword = '';
            this.newPassword1 ='';
            this.newPassword2 = '';
        },
        doChange: Promise.coroutine(function*() {
            if(this.newPassword1.length > 0) {
                if(this.newPassword1 === this.newPassword2) {
                    let response = yield $http.post('/personal/changePassword', {
                        oldPassword: this.oldPassword,
                        newPassword1: this.newPassword1,
                        newPassword2: this.newPassword2
                    });
                    if(typeof response.data === 'object' && response.data.success === true) {
                        successMessage('Your password was successfully changed');
                        this.reset();
                        $scope.$apply();
                    } else {
                        errorMessage('The entered password was incorrect');
                    }
                } else {
                    errorMessage('The new passwords don\'t match');
                }
            } else {
                errorMessage('The new password must not be empty');
            }
        })
    };
}]);
