testit.controller('AccountController', ['$scope', '$http', '$rootScope', 'Promise', function ($scope, $http, $rootScope, Promise) {
    'use strict';

    $scope.changePassword = {
        oldPassword: '',
        newPassword1: '',
        newPassword2: '',
        loading: false,
        cancel: function() {
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
                    console.log(response);
                } else {
                    swal('', 'The new passwords don\'t match', 'error');
                }
            } else {
                swal('', 'The new password must not be empty', 'error');
            }
        })
    };
}]);
