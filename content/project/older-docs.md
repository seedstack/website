---
title: "Older docs"
type: "home"
zones:
    - "Project"
aliases: /project/old-versions    
menu:
    project:
        parent: "project"
        weight: 3
---

On this page you can find the procedure to build the documentation for older versions.

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
