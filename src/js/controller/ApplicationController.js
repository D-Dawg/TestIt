window.testit.controller('ApplicationController', ['$scope', '$http', '$rootScope', 'Promise', 'errorMessage', 'successMessage', 'prompt', '$state', '$timeout', function ($scope, $http, $rootScope, Promise, errorMessage, successMessage, prompt, $state, $timeout) {
    'use strict';

    window.onbeforeunload = function (e) {
        if ($scope.application.wasModified || $scope.application.editing) {
            return 'You are still in edit mode';
        }
        return null;
    };

    $scope.application = {
        mode: 'builds',
        id: $state.params.id,
        beforeEditApplication: null,
        application: null,
        editing: false,
        loading: false,
        saving: false,
        wasModified: false,
        load: Promise.coroutine(function*() {
            this.loading = true;
            let response = yield $http.get(`/application/${this.id}`);
            this.application = JSON.parse(JSON.stringify(response.data));
            this.beforeEditApplication = JSON.parse(JSON.stringify(response.data));
            this.loading = false;
        }),
        discardChanges: function () {
            this.application = JSON.parse(JSON.stringify(this.beforeEditApplication));
            $timeout(() => {
                this.wasModified = false;
            });
        },
        saveChanges: Promise.coroutine(function*() {
            this.saving = true;
            this.beforeEditApplication = JSON.parse(JSON.stringify(this.application));
            yield $http.post('/application', this.application);
            this.saving = false;
            this.wasModified = false;
            $scope.$apply();
        }),
        addFeature: function (index) {
            this.application.features.splice(index, 0, {
                name: 'Feature Name',
                sections: []
            });
        },
        addBuild: function (index) {
            this.application.builds.splice(index, 0, {
                name: 'Build name',
                features: {}
            });
        },
        addSection: function (sections, index) {
            sections.splice(index || 0, 0, {
                name: 'Section Name',
                items: []
            });
        },
        addItem: function (items, index) {
            items.splice(index || 0, 0, 'Item');
        },
        move: function (arr, fromIndex, toIndex) {
            arr.splice(toIndex, 0, arr.splice(fromIndex, 1)[0]);
        },
        refreshFeatures: function () {
            let availableFeatures = [];
            _.each(this.application.features, feature => {
                availableFeatures.push(feature.name.toUpperCase().trim());
            });

            _.each(this.application.builds, build => {
                _.each(availableFeatures, feature => {
                    if (typeof build.features[feature] !== "boolean") {
                        build.features[feature] = false;
                    }
                });

                _.each(Object.keys(build.features), feature => {
                    if (availableFeatures.indexOf(feature) === -1) {
                        delete(build.features[feature]);
                    }
                });
            });
        }
    };

    $scope.$watch('application.application', (_new, _old) => {
        if (_old !== null && typeof _old === 'object') {
            $scope.application.wasModified = true;
        }
    }, true);

    $scope.application.load();

    let removeStateChangeListener = $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, options) {
        if ($scope.application.wasModified || $scope.application.editing) {
            event.preventDefault();
            errorMessage('You are still in editmode. Save or discard your changes first');
        }
    });

    $scope.$on('$destroy', () => {
        window.onbeforeunload = null;
        removeStateChangeListener();
    });
}]);
