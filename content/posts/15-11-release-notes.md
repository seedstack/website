---
Title: "15.11 release notes"
Description: We are happy to announce the release of SeedStack 15.11 !
Authors:
- Pierre THIROUIN
Date: 2015-11-27
Slug: 15-11-release-note
Tags:
- release
Zones:
- Posts
Post-categories:
- Release
---

We are happy to announce the release of SeedStack 15.11 ! This new version comes with several exiting features like
a new addons architecture, new supports for several NoSQL technologies, an embedded server, etc.

# Seed

## Addons architecture

The Seed framework has been lightened by extracting some modules into addons. Our previous concepts of "support" and
"function" have been replaced by the addons architecture.

Here is the complete addons list:

- audit
- elasticsearch **(new)**
- io
- javamail
- jcache
- jdbc
- jms
- jpa
- spring-bridge
- validation
- w20-bridge
- ldap
- mongodb **(new)**
- neo4j **(new)**
- redis **(new)**
- solr **(new)**
- scheduling
- web-services

These changes don't produce behavior breaking changes, but they imply maven dependencies breaking changes. This changes
can be fixed with our `seed fix` tool described above.

## Simplified packaging

We have also simplified our package name convention. All the APIs in a module are under the package `org.seedstack.modulename`,
for instance `org.seedstack.jpa` or `org.seedstack.business`. When an SPI is provided it is placed under `org.seedstack.modulename.spi`.
Finally all the internal classes are under `org.seedstack.modulename.internal`, we don't guarantee any compatibility for
them. Moreover, all the `internal` packages will be hidden when Seed will support Java 9. Like for the dependencies, these
changes can fixed using `seed fix`. You can see the result of this refactoring on the SeedStack aggregated [javadoc](seedstack.org/javadoc).

The configuration prefix have also been updated to reflect this new structure. They are also updated by the `seed fix` tool.
There is only some issues with the following configurations:

old:

```ini
org.seedstack.seed.persistence.jpa.units
org.seedstack.seed.persistence.jdbc.datasources
```

new:

```ini
org.seedstack.jpa.units
org.seedstack.jdbc.datasources
```

## Dependencies reduction

In the same reduction spirit, we have removed a lot of libraries bring by Seed. If you rely on some of them for your
project add them back to your `pom.xml`. Here is the complete list of removed libraries.

Scope compile:

```plain
commons-beanutils:commons-beanutils:1.8.3
org.json:json:20140107
commons-lang:commons-lang:2.6
```

Scope test:

```plain
commons-io:commons-io:2.4
pl.pragmatists:JUnitParams:1.0.3
org.easytesting:fest-reflect:1.4.1
org.json:json:20140107
org.jukito:jukito:1.1
org.hamcrest:hamcrest-core:1.3
org.hamcrest:hamcrest-library:1.3
org.powermock:powermock-core:1.6.2
org.powermock:powermock-api-mockito:1.6.2
org.powermock:powermock-module-junit4:1.6.2
org.skyscreamer:jsonassert:1.2.3
```

## New features

Seed 2.1.0 provides a new []cryptographic module](http://seedstack.org/docs/seed/manual/crypto/) which allow you to
easily crypt/decrypt data and configure keystores using props. It also provides [Undertow](http://undertow.io/) as a
built-in embedded server. This web server from Redhat shines by its performances and its lightness.

# Business

The Business framework also benefits from the package refactoring. But its more interesting new feature is the
`DomainRegistry` which allows to dynamically choose an implementation for all the domain objects. For instance,
if you want to choose a tax policy according the user's local, you can do it as follows:

```java
TaxPolicy taxPolicy = domainRegistry.getPolicy(TaxPolicy.class, userLocal);
```

The static equivalent would be:

```java
@Inject
@Named("fr")
TaxPolicy taxPolicy;
```

This registry can be used for: factories, policies, repositories and services.

# W20

