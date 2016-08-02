testit.controller('TemplateController', ['$scope', '$http', '$rootScope', 'Promise', 'errorMessage', 'successMessage', 'prompt', '$state', '$timeout', function ($scope, $http, $rootScope, Promise, errorMessage, successMessage, prompt, $state, $timeout) {
    'use strict';

    window.onbeforeunload = function (e) {
        if ($scope.template.wasModified || $scope.template.editing) {
            return 'You are still in edit mode';
        }
        return null;
    };

    $scope.template = {
        mode: 'builds',
        id: $state.params.id,
        beforeEditTemplate: null,
        template: null,
        editing:  false,
        loading: false,
        saving: false,
        wasModified: false,
        load: Promise.coroutine(function*() {
            this.loading = true;
            var response = yield $http.get(`/template/${this.id}`);
            this.template = JSON.parse(JSON.stringify(response.data));
            this.beforeEditTemplate = JSON.parse(JSON.stringify(response.data));
            this.loading = false;
        }),
        discardChanges: function() {
            this.template = JSON.parse(JSON.stringify(this.beforeEditTemplate));
            $timeout(() => {
                this.wasModified = false;
            });
        },
        saveChanges: Promise.coroutine(function*() {
            this.saving = true;
            this.beforeEditTemplate = JSON.parse(JSON.stringify(this.template));
            yield $http.post('/template', this.template);
            this.saving = false;
            this.wasModified = false;
            $scope.$apply();
        }),
        addFeature: function(index) {
            this.template.features.splice(index, 0, {
                name: 'Feature Name',
                sections: []
            });
        },
        addBuild: function(index) {
            this.template.builds.splice(index, 0, {
                name: 'Build name',
                sections: []
            });
        },
        addSection: function(sections, index) {
            sections.splice(index || 0, 0, {
                name: 'Section Name',
                items: []
            });
        },
        addItem: function(items, index) {
            items.splice(index || 0, 0, 'Item');
        },
        move: function(arr, fromIndex, toIndex) {
            arr.splice(toIndex, 0, arr.splice(fromIndex, 1)[0]);
        }
    };

    $scope.$watch('template.template', (_new, _old) => {
        if (_old !== null && typeof _old === 'object') {
            $scope.template.wasModified = true;
        }
    }, true);

    $scope.template.load();

    var removeStateChangeListener = $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, options) {
        if($scope.template.wasModified || $scope.template.editing) {
            event.preventDefault();
            errorMessage('You are still in editmode. Save or discard your changes first');
        }
    });

    $scope.$on('$destroy', () => {
        window.onbeforeunload = null;
        removeStateChangeListener();
    });
}]);
