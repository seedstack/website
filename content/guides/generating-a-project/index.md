---
title: "Generating a SeedStack project"
author: "Adrien LAUER"
date: 2018-09-11
tags:
    - tutorial
zones:
    - Guides
noMenu: true
---

Starting a project from scratch with Maven is not difficult but SeedStack makes it simpler with its generator. This
guide goes through the generation process, step-by-step.<!--more--> 

## Install Maven

The SeedStack project generator is implemented by the [generate goal]({{< ref "docs/maven-plugin/manual/generate.md" >}}) of
the SeedStack Maven plugin. It requires a functional Maven installation to properly work, including internet access.

You can skip this step, if you already have Maven installed, otherwise please follow the following official instructions: 

1. First download Maven by following [these instructions](https://maven.apache.org/download.cgi). 
2. Then install Maven by following [these instructions](https://maven.apache.org/install.html).

{{% callout tips %}}
Depending on your operating system, you may want to install Maven by using a package manager like [Homebrew for macOS](https://brew.sh/),
[Chocolatey for Windows](https://chocolatey.org/) or your Linux distribution package manager.
{{% /callout %}}

## Setup internet access

If you have a computer with direct internet access (without proxy) or your proxy is already configured, you can skip this
step. Otherwise you must configure Maven to go through the proxy. You can do so, by following [these instructions](https://maven.apache.org/guides/mini/guide-proxies.html).

In your `settings.xml` file you will end with something like this: 

```xml
<settings>
  ...
  <proxies>
   <proxy>
      <id>http-proxy</id>
      <active>true</active>
      <protocol>http</protocol>
      <host>proxy.example.com</host>
      <port>8080</port>
      <username>proxyuser</username>
      <password>somepassword</password>
      <nonProxyHosts>*.example.com</nonProxyHosts>
    </proxy>
   <proxy>
      <id>https-proxy</id>
      <active>true</active>
      <protocol>https</protocol>
      <host>proxy.example.com</host>
      <port>8080</port>
      <username>proxyuser</username>
      <password>somepassword</password>
      <nonProxyHosts>*.example.com</nonProxyHosts>
    </proxy>
  </proxies>
  ...
</settings>
```

## Invoke the generator

Using the command-line, go to the directory you want the project generated in and execute the following command:

```bash
mvn -U org.seedstack:seedstack-maven-plugin:generate
```

{{% callout info %}}
If your terminal doesn't support advanced prompt capabilities, the generator will fallback to basic prompt mode. 
If you encounter input difficulties, you can force the basic prompt mode by adding `-DbasicPrompt` to the command-line above.    
{{% /callout %}}

{{% callout tips %}}
A sub-directory will be created by generated project, named as the artifact id of the project. 
{{% /callout %}}

## Choose the project type

The first question the generator will ask is the type of project you want to create. Different project types lead to
slightly different project structures along with different sample code and configuration.
 
### Web 
 
The `web` project type is a **servlet-based Java application with an embedded Web server**. It has support for 
Domain-Driven Design and REST APIs. It can then be augmented with various SeedStack modules and add-ons.

### CLI

The `cli` project type is a **command-line Java application**. It has support for Domain-Driven Design and command-line
parsing. It can then be augmented with various SeedStack modules and add-ons.

### Batch

The `batch` project type is a **command-line Java application**. It has support for Domain-Driven Design and
Spring Batch integration. It can then be augmented with various SeedStack modules and add-ons.

### Domain

The `domain` project type is a **reusable Java library**. It has support for Domain-Driven Design. Its goal is to
allow reuse of domains between applications.

### Add-on

The `addon` project type is a **reusable Java library intended to extend SeedStack functionality**.
  
## Specify the project identity

Two questions are then asked to define the project identity, using [Maven coordinates](https://maven.apache.org/pom.html#Maven_Coordinates).
Enter the group id and artifact id of your project. The version will be `1.0.0-SNAPSHOT` by default.
  
## Answer additional questions

Some project types may trigger additional questions. The answer you provide are used to further customize the generated 
contents. If you cancel the generation before answering, the default answers will be used for all remaining questions.

## Build the project

To build the project, enter into the just-created project directory and run:

```bash
mvn clean install
```  

