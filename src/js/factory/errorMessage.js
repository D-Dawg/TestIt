testit.factory('errorMessage', ['swal', function(swal) {
    'use strict';
    return message => swal('', message, 'error');
}]);
