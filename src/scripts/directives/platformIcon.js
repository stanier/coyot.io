app.directive('platformIcon', function() {
    return {
        link: function(scope, element, attrs) {
            if (attrs.platformIcon == 'linux')   element.replaceWith('<i class="fa-5x pull-left fa fa-linux"/>');
            if (attrs.platformIcon == 'windows') element.replaceWith('<i classs="fa-5x pull-left fa fa-windows"/>');
            if (attrs.platformIcon == 'darwin')  element.replaceWith('<i classs="fa-5x pull-left fa fa-wheelchair"/>');
        }
    };
});
