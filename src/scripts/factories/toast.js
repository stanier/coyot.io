app.factory('ToastFactory', ['$mdToast', function($mdToast) {
    var simpleToast = $mdToast
        .simple()
        .highlightAction(true)
        .position('bottom right')
    ;

    return {
        success: function(text, action) {
            var toast = simpleToast
                .content(text || 'Action completed successfully!')
                .action(action || 'dismiss')
            ;

            $mdToast.show(toast);
        },
        error: function(text, action) {
            var toast = simpleToast
                .content(text || 'The requested action could not be completed.')
                .action(action || 'dismiss')
            ;

            $mdToast.show(toast);
        },
        show: function(text, action) {
            var toast = simpleToast
                .content(text)
                .action(action || 'dismiss')
            ;

            $mdToast.show(toast);
        }
    };
}]);
