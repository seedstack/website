(function (seedstack) {
    seedstack.strings = {
        parseQueryString: function (value) {
            var query = {};
            value.search.substr(1).split("&").forEach(function (item) {
                var k = item.split("=")[0], v = decodeURIComponent(item.split("=")[1]).replace(/\+/g, ' ');
                (k in query) ? query[k].push(v) : query[k] = [v]
            });

            return query;
        },

        toTitleCase: function (value) {
            var smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|vs?\.?|via)$/i;

            return value.replace(/[A-Za-z0-9\u00C0-\u00FF]+[^\s-]*/g, function (match, index, title) {
                if (index > 0 && index + match.length !== title.length &&
                    match.search(smallWords) > -1 && title.charAt(index - 2) !== ":" &&
                    (title.charAt(index + match.length) !== '-' || title.charAt(index - 1) === '-') &&
                    title.charAt(index - 1).search(/[^\s-]/) < 0) {
                    return match.toLowerCase();
                }

                if (match.substr(1).search(/[A-Z]|\../) > -1) {
                    return match;
                }

                return match.charAt(0).toUpperCase() + match.substr(1);
            });
        }
    };

    seedstack.ui = {
        openSearch: function () {
            $('.search-open').show();
            $('.search-btn').removeClass('fa-search').addClass('fa-times');
            $('#search-field').focus();
        },

        closeSearch: function searchClose() {
            $('#search-field').blur();
            $('.search-open').hide();
            $('.search-btn').addClass('fa-search').removeClass('fa-times');
        },

        openHelp: function () {
            $('#hotkeys-modal').modal('show');
        },

        closeHelp: function () {
            $('#hotkeys-modal').modal('hide');
        },

        openVersions: function () {
            $('#versions-modal').modal('show');
        },

        closeVersions: function () {
            $('#versions-modal').modal('hide');
        },

        shortcuts: {
            "h": "/",
            "d": "/docs",
            "a": "/addons",
            "g": "/guides"
        }
    };

    var event;
    try {
        event = new CustomEvent('seedstack')
    } catch (e) {
        // older browsers
        event = document.createEvent('CustomEvent');
        event.initCustomEvent('seedstack', true, false, null);
    }
    document.dispatchEvent(event);

})(window.seedstack);
