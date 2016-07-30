testit.factory('prompt', ['$mdDialog', function ($mdDialog) {
    'use strict';
    return message => {
        return $mdDialog.show($mdDialog.prompt({
            title: '',
            textContent: message,
            ok: 'Ok',
            cancel: 'Cancel'
        }));
    };
}]);
