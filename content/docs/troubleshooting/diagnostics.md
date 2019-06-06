---
title: "Diagnostics"
type: "home"
zones:
    - "Docs"
sections:
    - "Troubleshooting"    
tags:
    - troubleshooting
menu:
    docs-troubleshooting:
        parent: "basics"
        weight: 99
---

## Startup/shutdown diagnostic

When an exception is thrown on startup or shutdown, the full stacktrace is displayed in the console. But a YAML diagnostic
is also produced and written to a temporary directory. The diagnostic file contains information about the SeedStack and 
can be helpful to do advanced troubleshooting.

A warning log will tell where the diagnostic file is saved:

```plain
Diagnostic information dumped to file:///tmp/seedstack-diagnostics/seedstack-diagnostic-2019-06-06-14-06-21.111.yaml
```

## Web request diagnostic

If enabled, a diagnostic file can be dumped for each Web request ending with an exception. To enable it, set the following
configuration property:

```yaml
web:
  requestDiagnostic: true
``` 

{{% callout warning %}}
Don't enable that setting in any high-volume environment as it has the potential to fill your disk space very quickly and
diminish application performance. **Do not use in production.**
{{% /callout %}}

## Diagnostic tool

A diagnostic report can be created and written to the standard output by invoking the `diag` tool.

### During development

During project development, you can invoke the `diag` tool from the following Maven goal:

```bash
mvn seedstack:diag
```  

{{% callout tips %}}
As the diagnostic collects various information about the environment it can help troubleshoot issues that arise during
development, such as:

* Missing library from the classpath,
* Inconsistent versions between plugins,
* System properties values,
* ... 
{{% /callout %}}

### In staging/production

In staging or production environments, you can invoke the `diag` tool directly from the packaged executable capsule (JAR):

```bash
java -Dseedstack.tool=diag -jar my-project-capsule.jar
```  

{{% callout tips %}}
In staging/production, diagnostics can be useful to see if reality match expectations, like:

* Missing additional classpath locations,
* Application misconfiguration,
* ... 
{{% /callout %}}