app.filter('offsetBy', function() {
    return function(input, start) {
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 2cdf0ab203388c87ff6559b6ee5ace83da2d861f
        if (!!input) {
            start = + start;
            return input.slice(start);
        }
        return [];
<<<<<<< HEAD
=======
=======
        start =+ start;
        return input.slice(start);
>>>>>>> 170371a39f33798769600c509850e8e0d9d4eb52
>>>>>>> 2cdf0ab203388c87ff6559b6ee5ace83da2d861f
    };
});
