---
title: "Props and properties"
guide: "Make a configurable application"
author: "SeedStack"
menu:
    ConfigurationGuide:
        weight: 30
---

Props files are the recommended way to specify key/value pairs for the Seed unified configuration. Properties files can
also be used as a compatible alternative but with far less expressive power. Full props documentation is available 
[here](/docs/seed/manual/core/configuration).

# Location

To be recognized by Seed, props files must end with the `.props` extension and be located under the `META-INF/configuration`
location in the classpath. For a JAR file, it means having at least this top level inner directory structure:

    (archive.jar)               <-- the JAR file
        |-META-INF
            |-configuration
                |-*.props       <-- put all relevant props files here
            
The same directory structure should be used when adding a filesystem directory in the classpath. The added directory
must **contain** this directory structure:

    (/local/directory)          <-- the local directory added to the classpath
        |-META-INF
            |-configuration
                |-*.props       <-- put all relevant props files here
 
{{% callout info %}}
Please note that when multiple files with the same name and in the same classpath location (`META-INF/configuration` in 
this case) are present, only one file is visible from Java code, which one depending on the classpath entries order. 

To avoid this situation please be sure to name each props files differently, denoting its purpose in the same (for instance
you can name them `org.myorganization.myproject-security.props` and `org.myorganization.myproject-app.props` and both of 
them will be picked). 

It is sometimes desirable to use this characteristic to override a whole props file. In that case, be sure to put the 
location with the overriding file BEFORE the location with the overridden file.
{{% /callout %}}
 
# Props files content
 
You can use sections to help you write smaller props files. A section is a brackets-enclosed key name on its own line. 
Every line after it will be prefixed with the section name. To revert back to the global section (without prefix) use 
the empty section `[]` syntax.

Another trick of props files is that you can use macros. Macros are `${}` enclosed key names which are replaced by the 
corresponding value if found anywhere in the unified configuration (even if in another file of another classpath 
location). The macros can be used to externalize only a part of a value to another key/value pair located elsewhere.

# System properties

Props files can use system properties directly using the `${sys:name-of-system-property}` syntax. This can be used to
externalize values or parts of values as something that can be changed at every execution of the application (by just
passing a different `-Dname-of-system-property=value` argument to the JVM). The system property variable lookup is case
sensitive.

The JVM has several [predefined system properties](http://docs.oracle.com/javase/tutorial/essential/environment/sysprop.html)
which can also be used. It is notably useful for defining paths using platform-dependent separator or use the home or the
temporary directory. 

# Environment variables

Props files can also use environment variables directly using the `${env:NAME_OF_ENV_VARIABLE}` syntax. Please note that 
the environment variable lookup is case-sensitive.

# Externalisation

As a best-practice we recommend to use a controlled externalisation of application configuration. It must be seen as a
contract between the application and its runtime environment, and as such, between the people that own each. To establish
this contract, you can follow this process:

* For each props configuration file, asks yourself if it needs to be externalised at all.
* If some keys or some value parts need to be externalised, only externalise those using macros: replace the entire value
or the part of the value by a macro referencing a key that you will externalise. By limiting the configuration externalisation
to the necessary parts you will improve the encapsulation and the modularity of your application. You can view it as providing
well-defined setters for your internal configuration instead of making everything public.
* If some keys or some value parts are better suited for externalisation via system properties or environment variables,
 use the mechanisms described above to achieve this goal.
 
You will end with:

* One or more internal configuration props file(s),
* Exactly one externalisation file per environment containing only the externalised key/value pairs,
* Optionally some system properties or environment variables that should be defined in the environment.

{{% callout info %}}
As an alternative to the per-environment externalisation files, you can use a unique props externalisation file valued 
through a deployment-specific process.
{{% /callout %}}
