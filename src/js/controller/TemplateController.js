testit.controller('TemplateController', ['$scope', '$http', '$rootScope', 'Promise', 'errorMessage', 'successMessage', 'prompt', '$state', '$timeout', function ($scope, $http, $rootScope, Promise, errorMessage, successMessage, prompt, $state, $timeout) {
    'use strict';

    window.onbeforeunload = function (e) {
        if ($scope.template.wasModified) {
            return 'Your changes have not been saved';
        }
        return null;
    };

    $scope.template = {
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
                name: "My Feature",
                sections: []
            });
        },
        move: function(arr, fromIndex, toIndex) {
            arr.splice(toIndex, 0, arr.splice(fromIndex, 1)[0]);
        }
    };

    $scope.$watch('template.template', (_new, _old) => {
        if (_old !== null && typeof _old === "object") {
            $scope.template.wasModified = true;
        }
    }, true);

    $scope.template.load();

    var removeStateChangeListener = $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, options) {
        if($scope.template.wasModified) {
            event.preventDefault();
            errorMessage('You have unsaved changes. Save or discard them first');
        }
    });

    $scope.$on('$destroy', () => {
        window.onbeforeunload = null;
        removeStateChangeListener();
    });
}]);
