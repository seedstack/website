---
title: "Overview"
type: "reference"
zones:
    - "Seed"
sections:
    - "SeedShell"
tags:
    - "shell"
    - "command"
    - "maven"
    - "configuration"
menu:
    SeedShell:
        weight: 10
---

The SEED shell support provides an administration access to shell application commands through SSH protocol in two different modes:

* Interactive mode consists in providing of a simple line-based shell with auto-completion, history and the ability to display
command results as a string. In this mode, commands have no access to low-level input, output and error streams. They
take and produce discrete objects that are displayed as strings.
* Direct mode consists of a single command executed through an ssh remote invocation. In this mode, commands have
access to low-level input, output and error streams and thus can be combined with other commands on the client system.


# Configuration

## Maven dependency

To add shell support to your application, use the following dependency snippet:

    <dependency>
        <groupId>org.seedstack.seed</groupId>
        <artifactId>seed-shell-support</artifactId>
    </dependency>
    
Shell access is an application-specific feature and should generally be added in your applicative module.

## Properties

The configuration properties defining the shell support behavior are :

* `org.seedstack.seed.shell.enabled` which determines if shell access is enabled or not. **For security reasons, shell
access is disabled by default even with maven shell support dependency. If required, the property has to be set to `true`.**
* `org.seedstack.seed.shell.port` defines the port the SSH server will listen to. Defaults to 2222.
* `org.seedstack.seed.shell.key.type` defines what type of cryptographic key to use:
    * `generated` is the simplest and default mode. It generates a key in the application storage directory which is used 
    in subsequent authentication challenges. **Please note that this key type is NOT secured from a SSH perspective.**
    * `file` mode specifies the cryptographic key location on the filesystem via the `org.seedstack.seed.shell.key.location`
    configuration property. The key must be provided in a JCE serialized format.
    * `resource` mode specifies the cryptographic key location on the classpath via the `org.seedstack.seed.shell.key.location`
    configuration property. The key must be provided in a JCE serialized format.
    

# Commands


All commands registered by the core support `CommandActionRegistry` can be invoked from both interactive and
direct modes. See core support documentation for more details about command definitions. You can specify command name,
arguments and options using a GNU like syntax:

    [scope:]cmdname -s -sval --long-option --long-option-with-arg=argval arg0 arg1 arg2…
    
* The command scope must be specified as a prefix of the command name, delimited by a colon character.
* Short options are specified using the dash character (-) immediately followed by the option name and a value if needed.
* Long options are specified with two dash characters (--) immediately followed by the option name and, if required, an equal sign with a value.
* Arguments are specified respecting the command arguments order.

