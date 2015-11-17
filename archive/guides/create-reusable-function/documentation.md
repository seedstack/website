---
title: "Documentation"
guide: "Create a reusable function"
author: "SeedStack"
menu:
    CreateFunctionGuide:
        weight: 80
---

The *-doc module contains the function documentation. This documentation will be included in the Seed documentation site. It is organized as follows:

    ${project.basedir}
        - /doc
            - /markdown
                - *.md files
                - changelog.md
            - *-doc.w20.json
        - pom.xml

> The `*-doc.w20.json` file defines the routes used by the documentation site. The markdown files (`*.md`) contains the actual documentation. The changelog contains the updates by version. The pom contains an assembly to package the documentation for the site.

Functions use the Markdown format for documentation. It's a plain text format, human readable and easy to write.

# The mandatory points to document

- How to configure the persistence
- How to configure the security (permission mapping)
- Any function specific configuration
- Usage of API

# The changelog conventions

- A title by version `# Version 1.3.0`
- An change type indicator
    - [new] for new feature
    - [brk] for an API modification
    - [fix] for a fixed issue
    - [nfo] for more information
- One sentence description of the change

Example:

    # Version 2.0.0
    - [new] Add the ability to teleport.
    - [fix] Eradicate cancer.
    - [brk] Human walking on hands.


---

More resources on Markdown:

- [Markdown](http://en.wikipedia.org/wiki/Markdown)
- [Basics](https://help.github.com/articles/markdown-basics)
- IDE plugins
    - [For Eclipse](http://marketplace.eclipse.org/content/markdown-text-editor#.U7vjJfm9bg4)
    - [For Intellij IDEA](http://plugins.jetbrains.com/plugin/5970?pr=idea)
- Editors
    - [Online](https://stackedit.io/)
    - [For Windows](http://markdownpad.com/)

