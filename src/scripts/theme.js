app.config([
    '$mdThemingProvider',
    function($mdThemingProvider) {
        var customBlueMap = $mdThemingProvider.extendPalette('teal', {
            'contrastDefaultColor': 'light',
            'contrastDarkColors': ['50'],
            '50': 'ffffff'
        });

        $mdThemingProvider.definePalette('customBlue', customBlueMap);

        $mdThemingProvider.theme('default')
            .primaryPalette('customBlue', {
                'default': '400',
                'hue-1': '50'
            })
            .accentPalette('light-blue')
        ;

        $mdThemingProvider.theme('input', 'default')
            .primaryPalette('grey')
        ;
    }
]);
