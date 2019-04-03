---
title: "Shell function"
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
        weight: 15
---

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
