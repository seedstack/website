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

        showAllShortcuts: function () {
            $('.hidden-shortcuts').show();
            $('#show-all-shortcuts').hide();
        },

        shortcuts: {
            "B": "/docs/business",
            "b e": "/docs/business/manual/entity",
            "b v": "/docs/business/manual/value-object",
            "b a": "/docs/business/manual/aggregate",
            "b f": "/docs/business/manual/factory",
            "b r": "/docs/business/manual/repository",
            "b s": "/docs/business/manual/service",
            "b p": "/docs/business/manual/policy",
            "b A": "/docs/business/manual/assembler",
            "b F": "/docs/business/manual/finder",
            "b P": "/docs/business/manual/pagination",
            "b R": "/docs/business/manual/rest",
            "S": "/docs/seed",
            "s c": "/docs/seed/manual/core",
            "s s": "/docs/seed/manual/security",
            "s t": "/docs/seed/manual/transactions",
            "s p": "/docs/seed/manual/persistence",
            "s r": "/docs/seed/manual/rest",
            "s j": "/docs/seed/manual/jms",
            "s w": "/docs/seed/manual/web",
            "s m": "/docs/seed/manual/metrics",
            "s v": "/docs/seed/manual/validation",
            "s W": "/docs/seed/manual/ws",
            "s C": "/docs/seed/manual/cache",
            "s S": "/docs/seed/manual/scheduling",
            "W": "/docs/w20",
            "w c": "/docs/w20/manual/core",
            "w u": "/docs/w20/manual/ui",
            "w d": "/docs/w20/manual/dataviz",
            "w e": "/docs/w20/manual/extra",
            "T": "/docs/tools"
        }
    };

    seedstack.searchService = (function initializeIndex() {
        var lunrIndex,
            metadata;

        function ensureInitialized(callback) {
            if (!lunrIndex) {
                var searchIndexTimestamp = localStorage.getItem("searchIndexTimestamp");

                if (!searchIndexTimestamp || (new Date()).getTime() - searchIndexTimestamp > 86400 * 1000) {
                    console.log('fetching and building search index');
                    $.getJSON("/lunr-index.json", function (fetched) {
                        lunrIndex = lunr(function () {
                            this.field('title', {boost: 10});
                            this.field('tags', {boost: 5});
                            this.field('content');
                            this.ref('href');
                        });

                        $.each(fetched, function (dummy, doc) {
                            lunrIndex.add(doc);
                        });

                        metadata = fetched.map(function (doc) {
                            delete doc.content;
                            return doc;
                        });

                        localStorage.setItem("searchMetadata", JSON.stringify(metadata));
                        localStorage.setItem("searchIndex", JSON.stringify(lunrIndex));
                        localStorage.setItem("searchIndexTimestamp", (new Date()).getTime());

                        callback();
                    }).fail(function () {
                        console.error("unable to fetch index");
                    });
                } else {
                    console.log('loading search index from cache');
                    metadata = JSON.parse(localStorage.getItem("searchMetadata"));
                    lunrIndex = lunr.Index.load(JSON.parse(localStorage.getItem("searchIndex")));
                    callback();
                }
            }
        }

        // remove old index, TODO: remove in a few months from 2015-06-29
        localStorage.removeItem("pagesIndex");

        return {
            warm: function (callback) {
                ensureInitialized(callback);
            },

            clear: function () {
                localStorage.removeItem("searchMetadata");
                localStorage.removeItem("searchIndex");
                localStorage.removeItem("searchIndexTimestamp");
                lunrIndex = undefined;
                metadata = undefined;
            },

            search: function (q, callback) {
                ensureInitialized(function () {
                    if (typeof callback === 'function') {
                        callback(lunrIndex.search(q).map(function (result) {
                            return metadata.filter(function (page) {
                                return page.href === result.ref;
                            })[0];
                        }));
                    }
                });
            }
        };
    })();

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
