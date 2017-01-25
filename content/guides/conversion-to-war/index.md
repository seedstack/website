---
title: "Converting a standalone Web project to WAR"
name: "Converting a standalone Web project to WAR"
author: "SeedStack"
weight: -1
date: 2017-02-06
zones:
    - Guides
---

SeedStack projects created by the [generate goal](/docs/overview/maven-plugin/generate) of the SeedStack Maven plugin are
designed to be run from command-line with an embedded Web server. You can convert this kind of project to a classic WAR:

1. Add a `src/main/webapp` folder to hold the document root.
2. Add a `<packaging>war</packaging>` tag to the `pom.xml`.
3. Remove the `build-capsule` plugin execution (`package` goal of `seedstack-maven-plugin`) as this only works with 
standalone JAR files.
4. Configure the `maven-war-plugin` to ignore the absence of the `web.xml` file:

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
         
5. Exclude the embedded Web server from the Web composite:

        <dependency>
            <groupId>org.seedstack</groupId>
            <artifactId>web-composite</artifactId>
            <exclusions>
                <exclusion>
                    <groupId>org.seedstack.seed</groupId>
                    <artifactId>seed-web-undertow</artifactId>
                </exclusion>
            </exclusions>
        <dependency>
                
                