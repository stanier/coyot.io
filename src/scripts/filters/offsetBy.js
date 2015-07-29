app.filter('offsetBy', function() {
    return function(input, start) {
<<<<<<< HEAD
        if (!!input) {
            start = + start;
            return input.slice(start);
        }
        return [];
=======
        start =+ start;
        return input.slice(start);
>>>>>>> 170371a39f33798769600c509850e8e0d9d4eb52
    };
});
