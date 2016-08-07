window.testit.factory('errorMessage', ['$mdDialog', function($mdDialog) {
    'use strict';
    return message => {
        $mdDialog.show($mdDialog.alert({
            title: 'Oh no!',
            textContent: message,
            ok: 'Close'
        }));
    };
}]);
