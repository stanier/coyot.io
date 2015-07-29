app.filter('offsetBy', function() {
    return function(input, start) {
        if (!!input) {
            start = + start;
            return input.slice(start);
        }
        return [];
    };
});
