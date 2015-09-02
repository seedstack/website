var toml = require("toml");
var yaml = require("yamljs");
var s = require("string");
var natural = require("natural");
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
                    grunt.fail.warn("Could not find a YAML or TOML header in " + abspath);
                }
            }

            var href = s(abspath).chompLeft(CONTENT_PATH_PREFIX).chompRight(".md").s;

            // href for index.md files stops at the folder name
            if (filename === "index.md") {
                href = s(abspath).chompLeft(CONTENT_PATH_PREFIX).chompRight(filename).s;
            }

            // Build Lunr index for this page
            if (frontMatter.zones && config.params.zone[frontMatter.zones[0]] && frontMatter.sections && config.params.section[frontMatter.sections[0]]) {
                pageIndex = {
                    title: frontMatter.title,
                    tags: frontMatter.tags,
                    zone: config.params.zone[frontMatter.zones[0]],
                    section: config.params.section[frontMatter.sections[0]],
                    href: href,
                    content: processContent(splittedContent[2]),
                    summary: s(markdown.toHTML(splittedContent[2])).stripTags().truncate(300, "...").s.replace(/{{[^}]*}}/g, "")
                };
            } else {
                grunt.log.writeln("Ignoring page without zone and section: " + abspath);
            }

            return pageIndex;
        };

        grunt.file.write("static/lunr-index.json", JSON.stringify(indexPages()));
        grunt.log.ok("Index built");
    });
};
