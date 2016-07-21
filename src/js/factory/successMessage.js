testit.factory('successMessage', ['swal', function(swal) {
    'use strict';
    return message => swal('', message, 'success');
}]);
