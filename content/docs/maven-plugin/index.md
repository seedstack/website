---
title: "Usage"
type: "home"
zones:
    - "Docs"
sections:
    - "Maven"    
tags:
    - maven
menu:
    docs-maven:
        parent: "basics"
        weight: 10
---

The SeedStack Maven plugin provides goals to manage SeedStack-based artifacts.<!--more--> 

To invoke the plugin, use the following command line:

```bash 
mvn org.seedstack:seedstack-maven-plugin:<goal>
```

On generated projects, you can execute the shortened command:
 
```bash 
mvn seedstack:<goal>
```

This is because the project POM already contains the full coordinates of the plugin:

```xml
 <build>
    <pluginManagement>
        <plugins>
            <plugin>
                <groupId>org.seedstack</groupId>
                <artifactId>seedstack-maven-plugin</artifactId>
                <version>{{< version g="org.seedstack.maven" >}}</version>
            </plugin>
        </plugins>
    </pluginManagement>
</build>
```

An alternative is to edit your Maven `settings.xml` file to add the groupId `org.seedstack` to the `<pluginGroups>` list.
More information about Maven plugin prefix mapping [here](http://maven.apache.org/guides/introduction/introduction-to-plugin-prefix-mapping.html).        

## Shell function 

To simplify the invocation of the SeedStack plugin you can define the following UNIX shell function in your profile:

```bash
function seedstack {
    if [ -z "$1" ]; then
        echo "Usage: seedstack GOAL [ARGS]..."
        return 1
    fi
    GOAL=$1
    shift
    mvn -q -Dargs="$*" org.seedstack:seedstack-maven-plugin:$GOAL
}
```

This enables you to execute goals which use an `args` system property with real arguments:

```bash
seedstack config application.basePackages
```

Which is the equivalent of:
 
```bash
mvn -q -Dargs="application.basePackages" org.seedstack:seedstack-maven-plugin:config
```
