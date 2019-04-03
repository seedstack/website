---
title: "JAR Packaging"
type: "home"
zones:
    - "Docs"
sections:
    - "Maven"    
tags:
    - maven
aliases: /docs/maven-plugin/manual/package    
menu:
    docs-maven:
        parent: "development"
        weight: 40
---

The `package` goal packages any self-executable SeedStack application in a [Capsule](http://www.capsule.io/).
A Capsule is a way of packaging and running any application with all its dependencies from a unique plain executable JAR.<!--more-->

## Parameters

Parameters can be given as system properties (`-DparameterName=parameterValue`) or specified in the `pom.xml` plugin declaration:

<table class="table table-striped table-bordered table-condensed">
    <thead>
    <tr>
        <th>Name</th>
        <th>Type</th>
        <th>Mandatory</th>
        <th>Description</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>capsuleVersion</td>
        <td>String</td>
        <td>No</td>
        <td>The capsule version to be used. If not given, the latest version discoverable is automatically used.</td>
    </tr>
    <tr>
        <td>classpathEntries</td>
        <td>List of strings</td>
        <td>No</td>
        <td>The classpath entries to add to the application classpath.
        <br/>Relative paths are resolved to the location of the 
        capsule JAR. 
        <br/>The current user home path (~) can be used.</td>
    </tr>
    <tr>
        <td>systemProperties</td>
        <td>List of strings</td>
        <td>No</td>
        <td>The system properties to set when launching the application.</td>
    </tr>
    <tr>
        <td>environmentVariables</td>
        <td>List of strings</td>
        <td>No</td>
        <td>The environment variables to set when launching the application.</td>
    </tr>
    <tr>
        <td>jvmArgs</td>
        <td>List of strings</td>
        <td>No</td>
        <td>The JVM arguments to apply when launching the application.</td>
    </tr>
    <tr>
        <td>allowSnapshots</td>
        <td>-</td>
        <td>No</td>
        <td>If specified, the Capsule will allow SNAPSHOT dependencies to be used.</td>
    </tr>
    </tbody>
</table>

## Custom Classpath

The classpath of the capsule can be augmented:

* Statically with the `classpathEntries` plugin configuration attribute. In this case the entries are put in the 
JAR manifest and cannot be changed after the capsule has been built.
* Dynamically with the `capsule.classpath` system property on the command-line used to run the capsule.   

### Syntax of Classpath entries

The following features are available when specifying a Classpath entry:

* A tilde `~` character is resolved to the current user home directory,
* A dot `.` character is resolved to the directory where the capsule is located,
* When a plain directory is specified, it is added to the Classpath of the application as is,
* When a directory suffixed with `/*` is specified, all the JAR files inside this directory are added to the Classpath 
of the application.

### Static classpath

Classpath entries can be specified in the Maven configuration of the `package` goal:

```xml
<plugin>
    <groupId>org.seedstack</groupId>
    <artifactId>seedstack-maven-plugin</artifactId>
    <version>{{< version g="org.seedstack.maven" >}}</version>
    <executions>
        <execution>
            <id>build-capsule</id>
            <goals>
                <goal>package</goal>
            </goals>
            <configuration>
                <classpathEntries>
                    <classpathEntry>~/.app/etc</classpathEntry>
                    <classpathEntry>~/.app/lib/*</classpathEntry>
                    <classpathEntry>/opt/app/etc</classpathEntry>
                    <classpathEntry>/opt/app/lib/*</classpathEntry>
                </classpathEntries>
            </configuration>
        </execution>
    </executions>
</plugin>
```

In the example above:

* `etc` directories will be added as-is to the classpath
* JAR files contained in the `lib` directories will be directly added to the classpath. 

{{% callout info %}}
The order of static entries is preserved in the classpath. All static entries are placed before the application
entries so they can override them. 
{{% /callout %}}

### Dynamic Classpath

Classpath entries can be specified on the command-line using the `capsule.classpath` system property:

```bash
java -Dcapsule.classpath="/usr/local/app/etc:/user/local/app/lib/*" -jar my-capsule.jar
```

{{% callout info %}}
The order of dynamic entries is preserved in the classpath. All dynamic entries are placed before static entries in
the classpath so they can override them.
{{% /callout %}}

## Example

### Standalone Capsule

A standalone Capsule packs all its dependencies and is completely self-contained. It is the default mode of operation. To
build such a Capsule, use the following command:

```bash
mvn seedstack:package
```

## Running a capsule

To run a capsule, you simply execute it as a plain executable JAR:

```bash
java [jvm-args] -jar my-capsule.jar [args...]
```

In addition to any argument already specified in the capsule manifest (with the plugin parameters described above), you 
can specify any argument to the JVM or to the program as usual.

{{% callout tips %}}
A lot of options can be specified to alter the default behavior of the Capsule itself. Please refer to the [Capsule user-guide](http://www.capsule.io/user-guide/)
for more information.
{{% /callout %}}
