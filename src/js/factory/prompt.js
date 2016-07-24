testit.factory('prompt', ['$mdDialog', function ($mdDialog) {
    'use strict';
    return message => {
        return new Promise(resolve => {
            $mdDialog.show($mdDialog.prompt({
                title: 'Huh?',
                textContent: message,
                ok: 'Ok',
                cancel: 'Cancel'
            })).then(data => {
                if(data) {
                    resolve(data);
                } else {
                    resolve(null);
                }
            }, () => {
                resolve(null);
            });
        });
    };
}]);
