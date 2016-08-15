window.testit.controller('ApplicationController', ['$scope', '$http', '$rootScope', 'Promise', 'errorMessage', 'successMessage', 'prompt', '$state', '$timeout', '$mdDialog', function ($scope, $http, $rootScope, Promise, errorMessage, successMessage, prompt, $state, $timeout, $mdDialog) {
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
        availableFeatures: [],
        load: Promise.coroutine(function*() {
            this.loading = true;
            let response = yield $http.get(`/application/${this.id}`);
            this.application = JSON.parse(JSON.stringify(response.data));
            this.beforeEditApplication = JSON.parse(JSON.stringify(response.data));
            this.loading = false;
            this.refreshFeatures();
        }),
        discardChanges: function () {
            this.saving = true;
            this.application = JSON.parse(JSON.stringify(this.beforeEditApplication));
            $timeout(() => {
                this.wasModified = false;
                this.saving = false;
            }, 500);
            this.refreshFeatures();
        },
        saveChanges: Promise.coroutine(function*() {
            this.saving = true;
            this.refreshFeatures();
            this.beforeEditApplication = JSON.parse(JSON.stringify(this.application));
            yield $http.post('/application', this.application);
            this.saving = false;
            this.wasModified = false;
            $scope.$apply();
        }),
        showFeature: function (feature, ev) {
            let that = this;
            $mdDialog.show({
                controller: ['$scope', (_$scope) => {
                    _$scope.feature = feature;
                    _$scope.application = that;
                }],
                templateUrl: '/templates/dialogs/feature-dialog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
            });
        },
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
        editBuildName: function (build, ev) {
            prompt('Enter new build name').then(function (input) {
                build.name = input;
            });
        },
        copyBuild: function (builds, build) {
            let copy = JSON.parse(JSON.stringify(build));
            build.name = build.name + ' - copy';
            builds.splice(builds.indexOf(build), 0, copy);
        },
        refreshFeatures: function () {
            let availableFeatures = this.availableFeatures = [];
            _.each(this.application.features, feature => {
                if (availableFeatures.indexOf(feature.name.trim()) === -1) {
                    availableFeatures.push(feature.name.trim());
                }
            });

            _.each(this.application.builds, build => {
                _.each(availableFeatures, feature => {
                    if (typeof build.features[feature] !== 'boolean') {
                        build.features[feature] = false;
                    }
                });

                _.each(Object.keys(build.features), feature => {
                    if (availableFeatures.indexOf(feature) === -1) {
                        delete(build.features[feature]);
                    }
                });
            });
        },
        deleteItemWithModal: function (array, index, ev) {
            let confirm = $mdDialog.confirm()
            .title('Are you sure?')
            .targetEvent(ev)
            .ok('Yeah')
            .cancel('No');
            $mdDialog.show(confirm).then(() => {
                array.splice(index, 1);
            });
        },
        createTest(ev) {
            let that = this;
            $mdDialog.show({
                controller: ['$scope', (_$scope) => {
                    _$scope.application = that.application;
                    _$scope.users = $scope.users;
                    _$scope.permissions = $scope.permissions;
                    _$scope.createTest = {
                        metaData: {
                            application: that.application.name
                        },
                        loading: false,
                        selectedBuild: _$scope.application.builds[0],
                        assignee: $scope.users[0].user,
                        doCreate: function() {
                            this.loading = true;
                            $http.post('/test/fromApplication', {
                                _id: _$scope.application._id,
                                build: this.selectedBuild.name,
                                metaData: this.metaData,
                                assignee: this.assignee
                            }).success(response => {
                                $mdDialog.hide();
                                location.href='#/test/' + response._id;
                            });
                        }
                    };
                    _$scope.cancel = () => $mdDialog.hide();
                }],
                templateUrl: '/templates/dialogs/create-test-dialog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
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
