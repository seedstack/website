---
title: "Old versions"
type: "home"
zones:
    - "Project"
sections:
    - "ProjectOldVersions"
---

On this page you can find links to old versions of the SeedStack documentation and the procedure to build the documentation 
for versions not available on-line.

# Version 16.7

* <a href="//seedstack.org/archives/16.7" rel="nofollow">Website</a>
* <a href="//seedstack.org/archives/16.7/javadoc" rel="nofollow">Javadoc</a>
* <a href="https://github.com/seedstack/distribution/releases/tag/v16.7.4">Changelog</a>

# Other versions

Other versions are not available on-line. You can build them yourself from the repositories.

## The Website

Clone the [Website repository](https://github.com/seedstack/website):

```bash
git clone https://github.com/seedstack/website.git
```

Checkout the branch corresponding to the version you want to build: 

```bash
git checkout archive-???
```

Initialize the submodules

```bash
git submodule update --init --remote
```

Download [Hugo](https://gohugo.io/) if necessary and run:

```bash
hugo serve
```

Go to the [Hugo built-in Web server root](http://localhost:1313).

## The Javadoc

Clone the [Javadoc repository](https://github.com/seedstack/javadoc):

```bash
git clone https://github.com/seedstack/javadoc.git
```

Checkout the branch corresponding to the version you want to build: 

```bash
git checkout archive-???
```

Download and install [Apache Maven](http://maven.apache.org/) if necessary and run:

```bash
mvn clean install
```

Explore the generated Javadoc in `target/site/api-docs`.
