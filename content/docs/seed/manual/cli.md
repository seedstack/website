---
title: "Command-line"
type: "home"
zones:
    - "Seed"
sections:
    - "SeedManual"
tags:
    - "cli"
menu:
    SeedManual:
        weight: 30
---

Writing advanced command-line applications is simple with the Java framework command-line interface (CLI) module. Seed
provides support for multiple commands, each with their own options and argument combinations. To enable CLI support
to your project, add the `seed-cli` module to your classpath.

{{< dependency g="org.seedstack.seed" a="seed-cli" >}}

# Defining commands

To define a CLI command, simply declare a class implementing the {{< java "org.seedstack.seed.cli.CommandLineHandler" >}}
interface and annotated with {{< java "org.seedstack.seed.cli.CliCommand" "@" >}}:

    @CliCommand("my-command")
    public class MyCommandLineHandler implements CommandLineHandler {

        @Override
        public Integer call() throws Exception {
            return 0;
        }

    }

This will register the command named `my-command` without any option or argument. When this command is invoked
from the command-line, the `call` method is invoked. You must return an integer code from this method which will be
returned to the operating system.

# Running commands

When the `seed-cli` module is present on the classpath, you can launch any command by invoking the {{< java "org.seedstack.seed.core.SeedMain" >}}
main class from the command-line:

    java [jvm-args] -cp ... org.seedstack.core.SeedMain my-command

This will execute the `call()` method of the `MyCommandLineHandler` class defined above.

{{% callout warning %}}
The {{< java "org.seedstack.seed.core.SeedMain" >}} class will search for a *unique* implementation of the {{< java "org.seedstack.seed.spi.SeedLauncher" >}}
interface in the classpath and execute it. The `seed-cli` module provides an implementation for command-line execution
but the `seed-web-undertow` module provides one for embedded Web server execution. If both are in
the classpath at the same time, an exception will occur. **To avoid this situation, be sure use separate modules for
command-line applications and web applications.**
{{% /callout %}}

{{% callout tips %}}
One difficulty of running a Java application from the command line is to properly set its classpath. As such, launching
a Seed application from the command line is often used in combination with über-JAR packaging where a unique JAR contains
all the necessary classes and dependencies to run the application. With this kind of packaging, launching the application
becomes as simple as:

    java [jvm-args] -jar app.jar [app-args]

Check the [SeedStack Maven plugin](/docs/tools/maven-plugin) for more information about how to easily package such a JAR.
{{% /callout %}}

# Arguments and options

More often than not, commands must accept various options and arguments to alter their behaviors. This is well supported
by the Java framework through annotations:

* The {{< java "org.seedstack.seed.cli.CliOption" "@" >}} annotation can be applied to {{< java "org.seedstack.seed.cli.CommandLineHandler" >}}s
fields to inject an option.
* The {{< java "org.seedstack.seed.cli.CliArgs" "@" >}} annotation can be applied to {{< java "org.seedstack.seed.cli.CommandLineHandler" >}}s
fields to inject command arguments.

Consider the following example:

    @CliCommand("test")
    public class SampleCommandLineHandler implements CommandLineHandler {
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

{{% callout tips %}}
You can find more information about the various parameters and combinations in the [Javadoc](http://seedstack.org/javadoc/org/seedstack/seed/cli/package-summary.html).
{{% /callout %}}
