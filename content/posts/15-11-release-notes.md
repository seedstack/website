---
Title: "15.11 release notes"
Description: We are happy to announce the release of SeedStack 15.11!
Authors:
  - Pierre THIROUIN
  - Adrien LAUER
Date: 2015-11-27
Slug: 15-11-release-notes
Tags:
  - release
Zones:
  - Posts
---

We are happy to announce the release of SeedStack 15.11, codenamed "Hibiscus". This new version comes with a new 
add-on architecture and several new features like business framework improvements, a full-featured cryptography 
module and support for several NoSQL technologies.

# Automatic upgrade

The vast majority of upgrade tasks can be carried-on by our automatic upgrade tool. To automatically upgrade your project
download the tool executable available [here](https://github.com/seedstack/tools/releases), go to your project root directory
and execute the following command line:

```plain
seed -t https://raw.githubusercontent.com/seedstack/distribution/master/upgrades/15.7-to-15.11-upgrade.toml fix
```

Note that a small amount of tasks cannot be done automatically by the upgrade tool and must be applied manually. The rest
of this post describes all changes made by the tool but also details the eventual changes you need to apply.

# Changes

## Add-on architecture

A lot of modules have been extracted as add-ons. As such the foundation frameworks are lighter and simpler to understand.
The full list of available add-ons is available [here](/addons). Click on the add-on title to access
its documentation.

{{% callout info %}}
The refactoring into add-ons doesn't induce any behavior breaking change. These changes are automatically done by the upgrade
tool but some cleanup may be required:

* Some previous dependencies have been merged into a unique dependency and the tool is currently unable to eliminate the
leftover duplicates. **Please check your POM files for duplicate dependencies.** Don't forget that some dependencies can
be duplicated through inheritance.
* Business framework JPA-specific classes have been moved to the JPA add-on. As such the tool will convert any `business-jpa`
dependency into a `jpa` add-on dependency. If you did not also have the `business-core` dependency in the first place, it
will be missing: add it manually if you're in that case.
{{% /callout %}}

## Simplified packaging

We have also simplified our package naming conventions. All the APIs of a module are under the package `org.seedstack.[modulename]`.
For instance `org.seedstack.jpa` for the JPA add-on or `org.seedstack.business` for the business framework. The `api`
sub-package has been merged into the module top-level package. When an SPI is provided, it is still located under
`org.seedstack.[modulename].spi`. Finally all internal classes are located under `org.seedstack.[modulename].internal`.
**No compatibility is guaranteed for internal classes so your code should never rely on them.**

{{% callout info %}}
The simplified packaging doesn't induce any behavior breaking change. These changes are automatically done by the upgrade
tool.
{{% /callout %}}

{{% callout tips %}}
As the package layout is simpler, we decided to aggregate the Javadoc for the whole distribution (foundation frameworks
and official add-ons) into a [unique aggregated Javadoc](/javadoc).
{{% /callout %}}

## Simplified configuration

The configuration prefixes have also been updated to reflect these changes. This:

```ini
org.seedstack.seed.persistence.jpa.units
org.seedstack.seed.persistence.jdbc.datasources
```

Becomes:

```ini
org.seedstack.jpa.units
org.seedstack.jdbc.datasources
```

{{% callout info %}}
These changes are automatically done by the upgrade tool but some cleanup may be required. If a part of a key is defined
as a section, the upgrade tool may not recognize it:

```ini
[org.seedstack.seed.persistence]
jpa.units
jdbc.datasources
```

In this case, as the keys are broken apart, the tool cannot recognize the whole key and will not replace it. Please
review your configuration files for any occurence of this case.
{{% /callout %}}

## Dependency management

To avoid leaking dependency management in your projects, we have removed it all from SeedStack modules. Of course, the
distribution BOM still exists but importing it will not manage dependencies outside the SeedStack itself.

In the same reduction spirit, we have removed a lot of libraries bring by Seed. If you rely on some of them for your
project add their version explicitly in your `pom.xml` file.

## Dependency reduction

To reduce the footprint of SeedStack we removed dependencies that were not strictly necessary. Please add the required
one(s) back to your `pom.xml`:

Compile scope:

```plain
commons-beanutils:commons-beanutils:1.8.3
org.json:json:20140107
commons-lang:commons-lang:2.6
```

Test scope:

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

## W20 fragments refactoring

The W20 framework has been further modularized:

* Every fragment has become an addon to the exception of the core fragment which is mandatory.
* The `w20-ui` fragment has been **removed** and its rich components (UI-Grid and UI-Select) have been moved to a new `w20-components`
fragment. Its CSS framework-independent code has been merged into `w20-core`. Bootstrap 3 and UI-Bootstrap have been
moved to a new `w20-bootstrap-3` fragment.
* The `w20-components` fragment is new and contains the UI-Grid and UI-Select rich components previously found in the `w20-ui`
fragment.
* The `w20-bootstrap-3` fragment is new and contains the Bootstrap 3 CSS framework with its corresponding UI-Bootstrap helper.
* The `w20-bootstrap-2` fragment is new and contains the Bootstrap 2 CSS framework with its corresponding UI-Bootstrap helper.
* The `w20-material` fragment is new and contains the Angular Material CSS framework.

This allows to use alternative CSS frameworks with W20 such as the older Bootstrap 2 for compatibility purposes or
[Angular Material](https://material.angularjs.org/) to easily implement [material design](https://www.google.com/design/spec/material-design/introduction.html).
Bootstrap 4 support will be introduced as a fragment when released.

For `w20-bridge-addon` user, it is necessary to include the additional fragments which was all previously distributed by the `w20-bridge-web`artifact. For instance, this is the declaration necessary for including the w20-core, w20-dataviz, w20-bootstrap-3 and w20-business-theme fragments in maven:

```
<dependency>
    <groupId>org.seedstack.addons.w20</groupId>
    <artifactId>w20-bridge-web</artifactId>
</dependency>
<dependency>
    <groupId>org.seedstack.addons.w20</groupId>
    <artifactId>w20-bridge-web-dataviz</artifactId>
</dependency>
<dependency>
    <groupId>org.seedstack.addons.w20</groupId>
    <artifactId>w20-bridge-web-bootstrap-3</artifactId>
</dependency>
<dependency>
    <groupId>org.seedstack.addons.w20</groupId>
    <artifactId>w20-bridge-web-business-theme</artifactId>
</dependency>
```

# New features

## Cryptography

Seed provides a new [cryptography module](/docs/seed/manual/crypto/) which allow you to easily configure and use keystores.
It also provides a simpler API to encrypt and decrypt data.

## Domain registry

A domain registry has been added to the Business framework. It allows to dynamically retrieve a domain object instance.
This is particularly useful when you have multiple implementations for the same interface and you need to programatically
choose a specific implementation. The is often the case for policies. For instance, if you want to choose a tax policy
according the user's locale, you can do it as follows:

```java
TaxPolicy taxPolicy = domainRegistry.getPolicy(TaxPolicy.class, userLocale);
```

A static equivalent would be limited to an hard-coded locale value:

```java
@Inject
@Named("fr")
TaxPolicy taxPolicy;
```

{{% callout tips %}}
This new registry can be used for factories, policies, repositories and services.
{{% /callout %}}

## Spring-managed JPA transactions

When using the Spring-bridge add-on, you can now let Spring manage the JPA transactions across framework boundaries.
In this case, Seed code will be injected with a Spring-managed JPA entity manager instead of the Seed-managed one. This
is particularly useful in Spring batch jobs where there are clear performance benefits to let Spring batch manage the
transactions. More information about this feature [here](/addons/spring-bridge/transactions/).

## NoSQL add-ons

Three new add-ons are now provided to use popular NoSQL databases:

* [MongoDB add-on](/addons/mongodb),
* [Redis add-on](/addons/redis),
* [Neo4J add-on](/addons/neo4j),

## Solr add-on

A [Solr add-on](/addons/solr) is now provided to access Solr indexing servers.
