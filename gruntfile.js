var toml = require("toml");
var yaml = require("yamljs");
var s = require("string");
var natural = require("natural");
var _ = require("lodash");
var markdown = require("markdown").markdown;

var CONTENT_PATH_PREFIX = "content";

module.exports = function (grunt) {
    var tokenizer = new natural.WordTokenizer();
    var config = toml.parse(grunt.file.read('config.toml'));

    function processContent(content) {
        return tokenizer.tokenize(s(content).trim().stripTags().s).join(" ");
    }

    grunt.registerTask("lunr-index", function () {
        grunt.log.writeln("Building pages index");

        var indexPages = function () {
            var pagesIndex = [];
            grunt.file.recurse(CONTENT_PATH_PREFIX, function (abspath, rootdir, subdir, filename) {
                var pageIndex = processFile(abspath, filename);
                if (pageIndex) {
                    pagesIndex.push(pageIndex);
                }
            });

            return pagesIndex;
        };

        var processFile = function (abspath, filename) {
            var pageIndex;

            if (s(filename).endsWith(".md")) {
                pageIndex = processMDFile(abspath, filename);
            }

            return pageIndex;
        };

        var buildInfo = function (frontMatter, pageIndex, zone, fmAttribute) {
            pageIndex.zone = config.params.zone[zone];

            var basePath = s(pageIndex.href).chompLeft(pageIndex.zone.path + "/").s;
            basePath = basePath.substring(0, basePath.lastIndexOf("/"));
            pageIndex.section = {
                label: frontMatter[fmAttribute],
                path: basePath
            };
        };

        var processMDFile = function (abspath, filename) {
            var content = grunt.file.read(abspath);
            var splittedContent;
            var pageIndex;

            // First separate the Front Matter from the content and parse it
            var frontMatter;
            try {
                splittedContent = content.split("---");
                frontMatter = yaml.parse(splittedContent[1].trim());
            } catch (e1) {
                try {
                    splittedContent = content.split("+++");
                    frontMatter = toml.parse(splittedContent[1].trim())
                } catch (e2) {
                    grunt.log.warn("Could not find a YAML or TOML header in " + abspath);
                }
            }

            // Build Lunr index for this page
            if (frontMatter) {
                var href = s(abspath).chompLeft(CONTENT_PATH_PREFIX).chompRight(".md").s;

                // href for index.md files stops at the folder name
                if (filename === "index.md") {
                    href = s(abspath).chompLeft(CONTENT_PATH_PREFIX).chompRight(filename).s;
                }

                pageIndex = {
                    title: frontMatter.title,
                    tags: frontMatter.tags,
                    href: frontMatter.slug || href,
                    content: processContent(splittedContent[2]),
                    summary: s(markdown.toHTML(splittedContent[2])).stripTags().truncate(300, "...").s.replace(/{{[^}]*}}/g, "")
                };
		
		if (frontMatter.parent) {
		    pageIndex.parent = frontMatter.parent;
		}
                if (frontMatter.zones && config.params.zone[frontMatter.zones[0]] && frontMatter.sections && config.params.section[frontMatter.sections[0]]) {
                    pageIndex.zone = config.params.zone[frontMatter.zones[0]];
                    pageIndex.section = config.params.section[frontMatter.sections[0]];
                } else if (frontMatter.zones && config.params.zone[frontMatter.zones[0]]) {
                    buildInfo(frontMatter, pageIndex, frontMatter.zones[0], "name");
                } else if (frontMatter.zones && frontMatter.zones.indexOf("Posts") !== -1 && config.params.zone["Posts"]) {
                    buildInfo(frontMatter, pageIndex, "Posts", "title");
                } else {
                    grunt.log.writeln("Ignoring page without zone and section: " + abspath);
                    return null;
                }
            } else {
                grunt.log.writeln("Ignoring page without front matter: " + abspath);
                return null;
            }

            return pageIndex;
        };

        grunt.file.write("static/lunr-index.json", JSON.stringify(indexPages()));
        grunt.log.ok("Index built");
    });

    grunt.registerTask("smoke-tests", function () {
        var results = {};
        var servers = [];
        var idx = 0;

        grunt.log.writeln("Building server results");

        grunt.file.recurse("smoke-tests", function (abspath, rootdir, subdir, filename) {
            if (s(filename).endsWith('.json')) {
                grunt.log.writeln("Processing " + abspath);
                var server = JSON.parse(grunt.file.read(abspath));

                if (typeof server.serverName === 'string') {
                    servers.push(server.serverName);

                    _.each(server.results, function (value, key) {
                        key = s(key.replace(".", "-")).humanize().s;
                        var categoryResults = results[key] || {};

                        _.each(value, function (result, test) {
                            var sTest = s(test);
                            if (sTest.startsWith("test")) {
                                sTest = sTest.substring(4);
                            }
                            test = sTest.humanize().s;
                            var testResults = categoryResults[test] || {success: [], messages: []};
                            testResults.success[idx] = result.success;
                            testResults.messages[idx] = result.message;
                            categoryResults[test] = testResults;
                        });

                        results[key] = categoryResults;
                    });

                    idx++;
                }
            }
        });

        grunt.file.write("static/smoke-tests.json", JSON.stringify({
            "servers": servers,
            "results": results
        }));
    });
};
