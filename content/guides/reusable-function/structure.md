# Maven struture

## Maven parent

In the root pom:

    <parent>
        <groupId>com.inetpsa.fnd</groupId>
        <artifactId>seed-java-parent</artifactId>
        <version>XXX</version>
    </parent>

> Use the latest version of the seed-java-parent

## Maven coordinates

In the root pom:

    <groupId>com.inetpsa.[PRD]</groupId>
    <artifactId>[name]-function-root</artifactId>

## Module structure

* bom: versionning
* core: implementation
* doc: markdown documentation
* root: root module
* specs: API
* web: REST API and W20 screens (optional)

> Avoid using composite in your poms and just add the maven dependency required.

# Contents of each module

...
