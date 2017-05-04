---
title: "Converting a standalone Web project to WAR"
author: "Adrien LAUER"
date: 2017-02-06
tags:
    - web
    - maven
zones:
    - Guides
---

SeedStack projects created by the [generate goal](/docs/overview/maven-plugin/generate) of the SeedStack Maven plugin are
designed to be run from command-line with an embedded Web server. You can convert this kind of project to a classic WAR.<!--more-->

1. **Add** a `src/main/webapp` folder to hold the document root.
2. **Add** a `<packaging>war</packaging>` tag to the `pom.xml`.
3. **Remove** the `build-capsule` plugin execution (`package` goal of `seedstack-maven-plugin`) as this only works with 
standalone JAR files.
4. **Configure** the `maven-war-plugin` to ignore the absence of the `web.xml` file:

```xml
<build>
     <pluginManagement>
         <plugins>
             <plugin>
                 <groupId>org.apache.maven.plugins</groupId>
                 <artifactId>maven-war-plugin</artifactId>
                 <configuration>
                     <failOnMissingWebXml>false</failOnMissingWebXml>
                 </configuration>
             </plugin>
         </plugins>
     </pluginManagement>
</build>
```
         
5. **Remove** the embedded Web server from project dependencies:

```xml
<dependency>
    <groupId>org.seedstack.seed</groupId>
    <artifactId>seed-web-undertow</artifactId>
</dependency>
```
                
                
