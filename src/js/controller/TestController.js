window.testit.controller('TestController', ['$scope', '$http', '$rootScope', 'Promise', 'errorMessage', 'successMessage', 'prompt', '$state', '$interval', function ($scope, $http, $rootScope, Promise, errorMessage, successMessage, prompt, $state, $interval) {
    'use strict';
    $scope.test = {
        id: $state.params.id,
        loading: false,
        test: null,
        wasModified: false,
        saving: false,
        load: Promise.coroutine(function*() {
            this.loading = true;
            let response = yield $http.get(`/test/${this.id}`);
            this.test = response.data;
            this.loading = false;
        }),
        save: Promise.coroutine(function*() {
            if(this.saving) return;
            this.saving = true;
            this.wasModified = false;
            yield $http.post('/test', this.test);
            this.saving = false;
            $scope.$apply();
        })
    };

    $scope.$watch('test.test', (_new, _old) => {
        if (_old !== null && typeof _old === 'object') {
            $scope.test.wasModified = true;
        }
    }, true);

    window.onbeforeunload = function (e) {
        if ($scope.test.wasModified) {
            return 'You still have unsaved changes';
        }
        return null;
    };

    let autoSaveInterval = $interval(() => {
        console.log('beep');
        console.log($scope.test);
        if($scope.test.wasModified) {
            console.log('boop');
            $scope.test.save();
        }
    }, 5000);

    let removeStateChangeListener = $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, options) {
        if ($scope.test.wasModified) {
            event.preventDefault();
            errorMessage('You have still unsaved changes');
        }
    });

    $scope.$on('$destroy', () => {
        window.onbeforeunload = null;
        removeStateChangeListener();
        $interval.cancel(autoSaveInterval);
    });

    $scope.test.load();
}]);
