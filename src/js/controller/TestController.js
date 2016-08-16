window.testit.controller('TestController', ['$scope', '$http', '$rootScope', 'Promise', 'errorMessage', 'successMessage', 'prompt', '$state', '$interval', function ($scope, $http, $rootScope, Promise, errorMessage, successMessage, prompt, $state, $interval) {
    'use strict';
    $scope.test = {
        assignee: null,
        mode: 'items',
        id: $state.params.id,
        loading: false,
        test: null,
        wasModified: false,
        lastModifiedTimestamp: null,
        saving: false,
        load: Promise.coroutine(function*() {
            this.loading = true;
            let response = yield $http.get(`/test/${this.id}`);
            this.test = response.data;
            this.assignee = this.test.assignee;
            this.loading = false;
            $scope.$apply();
        }),
        save: Promise.coroutine(function*() {
            if (this.saving) {
                return -1;
            }
            this.saving = true;
            this.wasModified = false;
            yield $http.post('/test', this.test);
            this.saving = false;
            $scope.$apply();
        }),
        updateAssignee: function() {
            $http.post('/test/assign', {
                _id: this.id,
                assignee: this.assignee
            });
        },
        addComment: function(comments) {
            comments.push({
                status: 'HINT',
                text: ''
            });
        },
        addIssue: function(issues) {
            issues.push({
                key: '',
                status: 'UNTESTED',
                text: ''
            });
        }
    };

    $scope.$watch('test.test', (_new, _old) => {
        if (_old !== null && typeof _old === 'object') {
            $scope.test.lastModifiedTimestamp = Date.now();
            $scope.test.wasModified = true;
        }
    }, true);

    window.onbeforeunload = function (e) {
        if ($scope.test.wasModified) {
            return 'You still have unsaved changes';
        }
        return null;
    };

    let liveTestingInterval = $interval(() => {
        if($scope.test.lastModifiedTimestamp && $scope.test.lastModifiedTimestamp > Date.now() - 60000) {
            $http.post('/test/liveTesting/' + $scope.test.id, {});
        }
    }, 10000);

    let autoSaveInterval = $interval(() => {
        if ($scope.test.wasModified) {
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
        $interval.cancel(liveTestingInterval);
    });

    $scope.test.load();
}]);
