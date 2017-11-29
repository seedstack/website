---
title: "Running CLI applications"
type: "home"
zones:
    - "Docs"
tags:
    - cli    
aliases: /docs/seed/manual/cli
menu:
    docs:
        parent: "cli"
        weight: 1
---

The `seed-cli` module provides support for creating applications that are run from the command-line, accepting options
and arguments. <!--more--> 

Command-line support requires the following dependency in your project:

{{< dependency g="org.seedstack.seed" a="seed-cli" >}}

The `seed-cli` dependency provides a launcher that will handle startup and shutdown logic of the command-line application.

## Syntax

The first application argument to determine the name of the command-line handler. Further arguments depend on 
the executed command.

Example of running `myCommand` with `option1` as a capsule:

```bash
java -jar app-capsule.jar myCommand --option1
```

{{% callout info %}}
See how to define custom commands, on the [next page]({{< ref "docs/cli/commands.md" >}}). 
{{% /callout %}}
