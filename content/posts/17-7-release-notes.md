---
title: "17.7 release notes"
description: We are happy to announce the release of SeedStack 17.7!
authors:
  - Adrien LAUER
date: 2017-08-04
slug: 17.7-release-notes
aliases: "/posts/17-7-release-notes"
tags:
  - release
zones:
  - Posts
---

We are happy to announce the release of SeedStack 17.7 «Magnolia». This version focuses on cloud-related capabilities
(see AWS Lambda and Consul add-ons below) and much-improved project generation including an optional ready-to-use
Docker environment for your Web projects. <!--more--> 

{{% callout info %}}
See the [full changelog on GitHub](https://github.com/seedstack/distribution/releases/tag/v17.7).
{{% /callout %}}

# New features

## Amazon Web Services (AWS) add-on

A new AWS add-on provides the necessary support to run SeedStack code in [AWS Lambda](https://aws.amazon.com/lambda/details) 
server-less architecture.

## Consul add-on

A new [Consul add-on](http://seedstack.org/addons/consul) provides the ability to connect to one or more [Consul](https://www.consul.io/) 
instances, providing service discovery and distributed configuration features.

## Flyway add-on

A new [Flyway add-on](http://seedstack.org/addons/flyway) provides automatic relational database migration using [Boxfuse Flyway](https://flywaydb.org/). 
Databases configured with the JDBC add-on can automatically be migrated to their latest on application startup but tools
are also available to these migrations or other maintenance tasks manually.

## Web-bridge add-on

Security-related REST API, used to bridge frontend clients to SeedStack backends have now been extracted from the W20 bridge
add-on to a separate add-on, paving the way for Angular 2 and other frontend frameworks support. 

## Improved project generator

The `generate` goal of the project generator has been vastly improved. It is now capable of asking questions during 
generation and using the answers to customize the generated project. This is used to provide the following options in
the Web project template:

* Automatic persistence configuration, supporting JPA with Hibernate and MongoDb with Morphia.
* Automatic W20 UI configuration, allowing to choose the theme you want to use.
* Automatic Dockerization of the generated project, including a Docker compose file with the database if you choose one
of the supported persistences.

## HTTP/2

HTTP/2 is now enabled by default when running a Web application with the Undertow embedded server.

## New binding API

In addition to the existing `@Install` (which installs Guice modules) and `@ITBind` (which makes a class injectable during 
tests), the following features have been added:

* The `@Bind` annotation can make a class injectable in normal mode (not only in tests).
* The `@ITBind` and `@Bind` annotations can be used to inject the class through an interface or superclass by specifying 
the `from` parameter.
* The `@ITBind` and `@Bind` annotations can define an overriding binding instead of a normal one, allowing an existing 
binding to be overridden by it.
* The `@Install` annotation can install the module as an overriding module instead of a normal one, allowing it to
override any existing binding. 

See [@Bind](http://seedstack.org/javadoc/org/seedstack/seed/Bind.html) and [@Install](http://seedstack.org/javadoc/org/seedstack/seed/Install.html)
javadoc.

## Banner on startup

A default banner is now shown on SeedStack startup, displaying the version of the core and the version of the business
framework if present. This banner can be replaced by adding a `banner.txt` file at the root of the classpath. Banners
can be in color as shown by [this Nyan Cat example banner](https://gist.github.com/adrienlauer/f1515b5ee5e0ad9941d89d473f1d5a7a).

## Improved support for form authentication

Form authentication was possible before but necessitated multiple complex settings. Now all these setting are configurable
under `security.web.form`. You can now also directly configure the redirect after success and redirect after logout URL
with the `security.web.successUrl` and `security.web.logoutUrl` options.

# Fixes

This version contains fixes in various components, please check individual component change logs for details.

# Changes

This version only contains minor breaking changes, please check individual component change logs for details. 

## Upgraded dependencies

Various libraries have been upgraded, the major ones being: 

* Guice has been upgraded to [4.1.0](https://github.com/google/guice/wiki/Guice41).
* Shiro has been upgraded to [1.4.0](https://issues.apache.org/jira/secure/ReleaseNote.jspa?projectId=12310950&version=12338814).
* Jersey to [2.25.1](https://jersey.java.net/release-notes/2.25.1.html).
* Hibernate validator has been upgraded to [5.4.1.Final](https://github.com/hibernate/hibernate-validator/blob/5.4.1.Final/changelog.txt).
* Jackson has been upgraded to 2.8.9.
* Undertow has been upgraded to 1.4.14.

See individual component change logs for the full list of upgraded libraries. 

# Component versions

## General

* poms: **[3.1.0](https://github.com/seedstack/poms/releases/tag/v3.1.0)**
* seedstack-maven-plugin: **[2.6.0](https://github.com/seedstack/seedstack-maven-plugin/releases/tag/v2.6.0)**

## Core

* shed: **[1.1.0](https://github.com/seedstack/shed/releases/tag/v1.1.0)**
* coffig: **[3.0.1](https://github.com/seedstack/coffig/releases/tag/v3.0.1)**
* seed: **[3.3.0](https://github.com/seedstack/seed/releases/tag/v3.3.0)**
* business: **[3.1.0](https://github.com/seedstack/business/releases/tag/v3.1.0)**

## Add-ons

* audit-addon: **[3.0.0](https://github.com/seedstack/audit-addon/releases/tag/v3.0.0)**
* aws-addon: **[1.0.0](https://github.com/seedstack/aws-addon/releases/tag/v1.0.0)**
* consul-addon: **[1.0.0](https://github.com/seedstack/consul-addon/releases/tag/v1.0.0)**
* data-security-addon: **[1.0.0](https://github.com/seedstack/data-security-addon/releases/tag/v1.0.0)**
* elasticsearch-addon: **[3.0.0](https://github.com/seedstack/elasticsearch-addon/releases/tag/v3.0.0)**
* feign-addon: **[1.0.0](https://github.com/seedstack/feign-addon/releases/tag/v1.0.0)**
* flyway-addon: **[1.0.0](https://github.com/seedstack/flyway-addon/releases/tag/v1.0.0)**
* i18n-addon: **[3.0.0](https://github.com/seedstack/i18n-addon/releases/tag/v3.0.0)**
* io-addon: **[3.0.0](https://github.com/seedstack/io-addon/releases/tag/v3.0.0)**
* javamail-addon: **[3.0.0](https://github.com/seedstack/javamail-addon/releases/tag/v3.0.0)**
* jcache-addon: **[3.0.0](https://github.com/seedstack/jcache-addon/releases/tag/v3.0.0)**
* jdbc-addon: **[3.0.2](https://github.com/seedstack/jdbc-addon/releases/tag/v3.0.2)**
* jmh-addon: **[1.0.2](https://github.com/seedstack/jmh-addon/releases/tag/v1.0.2)**
* jms-addon: **[3.0.1](https://github.com/seedstack/jms-addon/releases/tag/v3.0.1)**
* jpa-addon: **[3.0.2](https://github.com/seedstack/jpa-addon/releases/tag/v3.0.2)**
* metrics-addon: [1.0.0](https://github.com/seedstack/metrics-addon/releases/tag/v1.0.0)
* ldap-addon: **[3.0.0](https://github.com/seedstack/ldap-addon/releases/tag/v3.0.0)**
* mongodb-addon: **[2.0.0](https://github.com/seedstack/mongodb-addon/releases/tag/v2.0.0)**
* monitoring-addon: **[3.1.0](https://github.com/seedstack/monitoring-addon/releases/tag/v3.1.0)**
* mqtt-addon: **[2.0.1](https://github.com/seedstack/mqtt-addon/releases/tag/v2.0.1)**
* neo4j-addon: **[2.0.0](https://github.com/seedstack/neo4j-addon/releases/tag/v2.0.0)**
* netflix-addon: **[1.0.1](https://github.com/seedstack/netflix-addon/releases/tag/v1.0.1)**
* redis-addon: **[2.0.0](https://github.com/seedstack/redis-addon/releases/tag/v2.0.0)**
* scheduling-addon: **[3.0.0](https://github.com/seedstack/scheduling-addon/releases/tag/v3.0.0)**
* shell-addon: **[1.0.0](https://github.com/seedstack/scheduling-addon/releases/tag/v1.0.0)**
* solr-addon: **[2.0.0](https://github.com/seedstack/solr-addon/releases/tag/v2.0.0)**
* spring-bridge-addon: **[3.1.0](https://github.com/seedstack/spring-bridge-addon/releases/tag/v3.1.0)**
* swagger-addon: **[2.0.1](https://github.com/seedstack/swagger-addon/releases/tag/v2.0.1)**
* w20-bridge-addon: **[3.1.0](https://github.com/seedstack/w20-bridge-addon/releases/tag/v3.1.0)**
* web-bridge-addon: **[1.0.0](https://github.com/seedstack/web-bridge-addon/releases/tag/v1.0.0)**
* web-services-addon: **[3.0.1](https://github.com/seedstack/web-services-addon/releases/tag/v3.0.1)**



