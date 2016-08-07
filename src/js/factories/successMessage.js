window.testit.factory('successMessage', ['$mdDialog', function ($mdDialog) {
    'use strict';
    return message => {
        $mdDialog.show($mdDialog.alert({
            title: 'Yippie!',
            textContent: message,
            ok: 'Close'
        }));
    };
}]);
