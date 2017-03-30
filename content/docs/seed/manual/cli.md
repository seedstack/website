---
title: "Command-line"
type: "home"
zones:
    - "Seed"
sections:
    - "SeedManual"
tags:
    - cli    
menu:
    SeedManual:
        weight: 20
---

The `seed-cli` module provides support for creating applications that are run from the command-line, accepting options
and arguments. <!--more--> 

# Dependency

Command-line support requires the following dependency in your project:

{{< dependency g="org.seedstack.seed" a="seed-cli" >}}

# Defining commands

To define a CLI command, simply declare a class implementing the {{< java "org.seedstack.seed.cli.CommandLineHandler" >}}
interface and annotated with {{< java "org.seedstack.seed.cli.CliCommand" "@" >}}:

    @CliCommand("myCommand")
    public class MyCommandLineHandler implements CommandLineHandler {
        @Override
        public Integer call() throws Exception {
            return 0;
        }
    }

This will register the command named `myCommand` without any option or argument. When this command is invoked
from the command-line, the `call` method is invoked. You must return an integer code from this method which will be
returned to the operating system.

# Arguments and options

More often than not, commands must accept various options and arguments to alter their behaviors. This is well supported
by the Java framework through annotations:

* The {{< java "org.seedstack.seed.cli.CliOption" "@" >}} annotation can be used on fields to inject an option.
* The {{< java "org.seedstack.seed.cli.CliArgs" "@" >}} annotation can be used on fields to inject command arguments.

Consider the following example:

    @CliCommand("myCommand")
    public class MyCommandLineHandler implements CommandLineHandler {
        @CliOption(name = "o1", longName = "option1")
        private Boolean hasOption1;

        @CliOption(name = "o2", longName = "option2" valueCount = 1, mandatory = true)
        private String option2;

        @CliOption(name = "o3", valueCount = 2, mandatoryValue = true, defaultValues = {"1", "2"})
        private String[] option3;

        @CliOption(name = "o4", valueCount = -1, valueSeparator = '=')
        private Map<String, String> option4;

        @CliArgs(mandatoryCount = 2)
        private String[] args;

        @Override
        public Integer call() throws Exception {
            return 0;
        }
    }

The annotations above define:

* An option named `o1` or `option1` which acts as a flag, present or not. Its presence is injected in the `hasOption1`
boolean field. *This can be specified with `-o1` or `--option1` on the command-line.*
* An option named `o2` or `option2` which takes a unique value. Its value is injected in the `option2` string field.
This option is mandatory. *This can be specified with the `-o2 value` or `--option2 value` on the command-line.*
* An option named `o3` which takes 2 comma-separated values (the default separator). The values for this option are
mandatory and default to `1` and `2`. They are injected in the `option3` string array field. *This can be specified with
`-o3 5,6` on the command-line*.
* An option named `o4` which takes and unlimited number of values separated by `=`. The odd/even value pairs are injected
as key/value pairs in the map. *This can be specified as `-o4 key1=value1 -o4 key2=value2` on the command-line*.
* Any number of arguments with at-least two which are mandatory. *This can be specified as `arg1 arg2` on the command-line*.

{{% callout ref %}}
You can find more information about the various parameters and combinations in the [Javadoc](http://seedstack.org/javadoc/org/seedstack/seed/cli/package-summary.html).
{{% /callout %}}

# Running commands

The `seed-cli` dependency provides a launcher that will handle startup and shutdown logic of the command-line application.
It takes the first application argument to determine the name of the command-line handler. Further arguments are dependent 
upon the chosen handler.

Example of running `myCommand` with `option1` as a capsule:

     java -jar app-capsule.jar myCommand --option1

{{% callout ref %}}
Command-line applications are started and stopped as described in [this page](../running).
{{% /callout %}}        
