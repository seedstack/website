---
title: "Basics"
type: "home"
zones:
    - "Seed"
sections:
    - "SeedManual"
tags:
    - "startup"
    - "shutdown"
    - "configuration"
    - "injection"
    - "diagnostic"
    - "lifecycle"
    - "logging"
menu:
    SeedManual:
        weight: 10
---

SeedStack Java framework (or simply Seed) is a solution for building Java applications, no matter how simple or advanced,
without pain. It does so by providing a simple yet highly modular architecture and by taking charge of various technical 
aspects frequently encountered in enterprise applications. It accommodates any kind of Java 1.6+ runtime and offers the 
same level of features from command-line standalone JVMs to full-fledged Web application servers. 

# Dependencies

A minimal Seed-based project only requires the `seed-core` module and its dependencies in the classpath. This module
provides basic Seed functionality to your application like lifecycle management, configuration, dependency injection,
logging or error diagnostics. To include `seed-core` in your application you have two main options:
  
* Using a dependency manager like [Maven](http://maven.apache.org) or [Gradle](http://gradle.io). **This is the recommended
solution.**
* Add `seed.jar` manually to your application. This JAR contains all Seed code and the required dependencies in a single,
convenient yet big, library.  

{{< dependency g="org.seedstack.seed" a="seed-core" >}}

{{% callout tips %}}
If you're using Maven, SeedStack provides comprehensive dependency management in its distribution, whether by inheriting
from its parent or by importing its BOM. We recommend doing so to ensure that versions of Seed dependencies are consistent
across the project. Additionally you won't have to specify the version tag of any Seed dependency. Check the
[distribution documentation page](/docs/getting-started/distribution) for more information.
{{% /callout %}} 
 
# Startup and shutdown

Starting a Seed application consists in creating a Kernel instance and invoking its startup logic. Later, the 
application can be cleanly stopped by invoking the kernel stopping logic. All these steps are already encapsulated by Seed
for two main runtime environments:

* The command line,
* The external servlet-based Web application server.

## Command line

### Launch from command line

This is the simplest way to launch a Seed application. You do so by executing the {{< java "org.seedstack.core.SeedMain" >}} class with
the JVM:

    java [jvm-args] -cp ... org.seedstack.core.SeedMain [app-args]
    
The `SeedMain` class will search the classpath for an implementation of the {{< java "org.seedstack.core.spi.SeedLauncher" >}} interface
and execute its `launch()` method with the application arguments. Exactly one launcher must be present in the classpath or
an exception will be thrown. 

{{% callout info %}}
Launchers live in various Seed modules such as the `seed-cli` module, handling command-line-interface (CLI) applications
or the `seed-web-undertow` module, providing an [Undertow](http://undertow.io/) embedded Web server. Without such module
containing a launcher in classpath an exception will be thrown.
{{% /callout %}} 

{{% callout tips %}}
One difficulty of running a Java application from the command line is to properly set its classpath. As such, launching
a Seed application from the command line is often used in combination with über-JAR packaging where a unique JAR contains 
all the necessary classes and dependencies to run the application. With this kind of packaging, launching the application
becomes as simple as:

    java [jvm-args] -jar app.jar [app-args]

Check the [SeedStack Maven plugin](/docs/tools/maven-plugin) for more information about how to easily package such a JAR.  
{{% /callout %}}
 
### Shutdown from command line

To shutdown a Seed application from the command line, you simply have to gracefully stop the JVM. You can do this on any 
operating system this by hitting `CTRL+C` if the JVM is a foreground process. You can also do this under UNIX systems if
the JVM is a background process by issuing a `SIGINT` signal to the JVM process:
 
    kill -2 pid
    
In any case, the shutdown logic of the Seed application will be invoked.
     
{{% callout warning %}}
Warning! If you abruptly terminate or kill the JVM process, the application will NOT gracefully shutdown.  
{{% /callout %}}
  

## Launch in Web application server

A servlet-based Web application server directly manages the lifecycle of an application. If your server is at least at
the Servlet 3.0 level of Servlet API, the `seed-web-core` module already contains the necessary classes to trigger Seed 
startup and shutdown in response to server events.

{{% callout tips %}}
If your Servlet API level is lower than 3.0, please check [this page](web) for the required configuration of your application. 
{{% /callout %}}

# Logging

Logging is a necessity in almost any application. Seed is built upon the popular [SLF4J logging facade](http://www.slf4j.org) 
and provides its Java Commons Logging bridge and Java Util Logging bridge out-of-the-box. The choice of the SLF4J 
implementation is left to you but we recommend [Logback](http://logback.qos.ch/). Seed provides sensible defaults for
Logback in the `org/seedstack/seed/core/logging/logback-defaults.xml` resource which can be imported in any Logback
configuration file:

    <include resource="org/seedstack/seed/core/logging/logback-defaults.xml"/>
    
{{% callout tips %}}
These defaults include two `stdout` console appenders called `STDOUT` for a monochrome output or `STDOUT-COLOR` for a
colorized output. You can use these appenders in any of your configured loggers at your discretion.
{{% /callout %}}


You can inject a logger in any class by annotating an SLF4J logger field with `@Logging`:

    @Logging
    private Logger logger;

This will automatically inject a logger for the enclosing class. This also works on static fields although if you need 
your logger fields to be final, you must use the traditional SLF4J syntax instead.

# Configuration

Seed provides an unified configuration mechanism that is simple to use, thanks to its strict key/value paradigm, but also 
very powerful. 

Classpath scanning is used to discover all application configuration files present in the `META-INF/configuration` 
locations of the classpath, which are aggregated in a global configuration available from anywhere in the application. Seed 
supports two configuration file formats:

* The recommended **Props format** which is a superset of the classic Java Properties format providing a more concise and 
expressive configuration language. Props files must have the `props` extension.
* The legacy **Properties format** which is described [here](<http://docs.oracle.com/javase/6/docs/api/java/util/Properties.html#load\(java.io.Reader\)>). 

All files must be located under the `META-INF/configuration` directory: 

```plain
META-INF/configuration
    |
    |- my-app.props
    |- security.props
    |- legacy.properties
    |- ...
```  

{{% callout tips %}}
Lots of configuration features, such as profiles, sections, appending, etc. are only supported with the Props format. 
Try to avoid the legacy Properties format if possible.
{{% /callout %}}

## Bootstrap configuration

A few configuration values must be configured in a special configuration file that **must** be named `seed.props` (or 
`seed.properties`). This file must also be put in the `META-INF/configuration` folder. The most frequent usage of this 
file is to define the base package(s) that Seed must scan. You can do so with the following :

```ini
[org.seedstack.seed]
base-packages = org.my.package, com.my.other.package, ...
```

{{% callout warning %}}
It is important to set the `org.seedstack.seed.base-packages` property of bootstrap configuration for Seed to scan your classes. If you omit to do so, Seed will only scan `org.seedstack` and its sub-packages by default.
{{% /callout %}}

{{% callout tips %}}
Note that the bootstrap configuration contents will also be available as normal application configuration. As such, you can choose to put all your configuration (bootstrap or not) in this file.
{{% /callout %}}

## Props format

### Base characteristics

* By default, props files are UTF-8 encoded, but can be encoded in any encoding.
* Leading and trailing spaces will be trimmed from section names, property names.
* Either equal sign (=) or colon (:) are used to assign property values.
* Comments begin with either a semicolon (;), or a sharp sign (#) and extend to the end of line. It doesn't have to be 
the first character.
* A backslash (`\`) escapes the next character (e.g., `\#` is a literal `#`, `\\` is a literal `\`).
* \\uXXXX is encoded as character. Also `\t`, `\r` and `\f` are encoded as characters.

### Sections
Sections looks very much like Windows INI file sections. In props files, a section simply represents a key prefix for
following keys, until the section end or end of file. 

* Section names are enclosed between `[` and `]`. 
* Properties following a section header belong to that section. 
* Section name is added as a prefix to section properties. 
* Section ends with empty section definition `[]` or with new section start or end of file.

The following example:

    [users.data]
    weight = 49.5
    height = 87.7
    age = 63
	
	[]
    comment=this is base property

is equivalent to this one:

    users.data.weight = 49.5
    users.data.height = 87.7
    users.data.age = 63
    comment=this is base property


### Profiles

Seed provides a configuration profile concept which is activated via the `org.seedstack.seed.profiles` system property.
Profiles are determined at application initialization and cannot be changed afterwards. You can activate several profiles 
simultaneously by using **a comma separated list**. For example, following JVM argument activates both `dev` and `debug` 
profiles:

    -Dorg.seedstack.seed.profiles=dev,debug

* Profile names are enclosed between `<` and `>`.
* They can be used as a part of a property key.
* One key can contain one or more profile name.
* **A good practice** consists in keeping them at the end but they could be used anywhere in a key.
* Properties without a profile are base properties and are available without providing any profile. 

For example :

    db.port=3086

    db.url<dev>=localhost
    db.username<dev>=root

    db.url<prod>=productionmachine.myorganization.org
    db.username<prod>=securedaccount

In above example, `db.port` key provides a base property that will always be available whereas other keys are dependant 
on a profile name (`dev` or `prod`). Therefore, these values would be available only if the corresponding profiles 
(environments here) are requested through JVM `org.seedstack.seed.profiles` argument.

Since profiles can be anywhere in the key name, section names can contain profile definitions as well. The above example 
can also be written as follows:

    db.port=3086

    [db<dev>]
    url=localhost
    username=root

    [db<prod>]
    url=productionmachine.myorganization.org
    username=securedaccount


There are cases where two ore more profiles share most of their configuration and only few properties are
different or specific to one profile. To avoid repeating shared properties for each profile, it is possible to define 
different/specific properties assigned to inner profiles only. Props will first lookup keys in inner profiles, then go 
up to the base level. For example :

    key1<one>=Hi!
    key2<one>=...
    ....
    key100<one>=...

    key1<one.two>=Hola!

This example defines two profiles. First one is named 'one' and contains 100 properties. Second profile is an inner
property named 'one.two'. It contains only 1 property (key1) - but all properties from its parent profile are available.

### Macros

A macro is a reference to some keys' value inside the value of another key. Macros are enclosed between `${` and `}`. Here is a
simple example:

    key1=Something ${foo}
    ...
    foo=nice

Value of key1 is 'Something nice'. Macros can refer to any existing property key, no matter where it is defined. Therefore, 
nested macros are also supported as in following example:

    key1=**${key${key3}}**
    key3=2
    key2=foo

Value of key1 is '**foo**'.

### Multi-line values

Multi-lines values are defined with triple-quotes. Everything in-between is considered as a value. For example:

    email.body='''
        Hello $n,

        welcome!
    '''

Note that multi-line values are NOT trimmed. Therefore, the value from the example will consist of 5 lines. There is no
need to escape new lines in multi-line values.

### Value appending

Values with the same key name are automatically appended to each other with a comma (`,`) separator. With the following
configuration:

    org.myorganization.myproject.toto = val1
    org.myorganization.myproject.toto = val2

The `org.myorganization.myproject.toto` value evaluates to `val1,val2`. You can then retrieve this kind of value as a 
normal string or as a string array.

### Copy operator

The copy operator can be used to share a set of properties in different sections by copying them. Consider the following
example:

    org.myorganization.myproject1.action1=value1
    org.myorganization.myproject1.action2=value2
    ...
    org.myorganization.myproject2.action1=value1
    org.myorganization.myproject2.action2=value2
    ...
    org.myorganization.myproject3.... # etc

Props allows you to use copy operator: `<=` in order to minimize and clarify the declarations required. Above props can 
be written as follows instead:

    [actions]
    action1=value1
    action2=value2
    ...

    []
    org.myorganization.myproject1 <= actions

    [org]
    myorganization.prd2 <= actions

    [org.myorganization.myproject3]
    <= actions

The above example shows 3 different but equivalent ways to use copy operator:

* without sections
* with partial section 
* with full section

Note that copied values are set as macros, so all above copied properties are identical to:

    org.myorganization.myproject1.action1=${actions.action1}
    org.myorganization.myproject1.action2=${actions.action2}
    org.myorganization.myproject2.action1=${actions.action1}
    ....

All rules for resolving macros apply.

## Environment variables

System environment variables are provided through configuration, using a macro prefixed by `env:`. For example:

    [db]
    url = jdbc:mysql://${env:MYSQL_SERVER}/test

**Please note that the environment variable lookup is case-sensitive**, contrary to the `System.getenv(variableName)` java
method. Its behavior is equivalent to `System.getenv().get(variableName)`.

## System properties

JVM system properties are provided through configuration, using a macro prefixed by `sys:`. For example:

    [indexer]
    path = ${sys:java.io.tmpdir}${sys:file.separator}my-index

The system property lookup is case-sensitive, just as `System.getProperty(propertyName)` java method.

## Constant values

Class constant values (i.e. `static final` fields) are available in props configuration with `const:` prefix. 
For example:

    [action1]
    key = ${const:java.awt.event.KeyEvent.VK_CANCEL}

The value of `action1.key` is the value of `VK_CANCEL` constant retrieved from `java.awt.event.KeyEvent` class.

## Override

Nominal configuration can be overridden explicitly using resources names ending with `*.override.properties` and 
`*.override.props`. Nominal and override configuration are loaded completely separately and cannot interact with each
other except in the following ways:

* If a key is present both in nominal and override configuration, the override value completely replaces the nominal one.
* If a key is present in override configuration but not in nominal configuration, it is added to the nominal configuration.
* If a key is present both in nominal and override configuration but prefixed by a dash (`-`) in override configuration it
is removed from nominal configuration.

As an example, with this nominal configuration:
 
    overriddenValue = I'm overridden
    removedValue = I'm removed
    emptiedValue = I'm emptied

And this override configuration:

    overriddenValue = I'm overriding
    -removedValue =
    emptiedValue =
    -removedNonExistentValue =

You end with the following:

* `overriddenValue` evaluates to `'I'm overriding'`.
* `emptiedValue` evaluates to an empty string.
* `removedValue` evaluates to `null` as if it was never declared in the first place. 

{{% callout tips %}}
Please note that as the nominal and the override configurations are completely separate, no macro resolution can take
place between the two. Also note that the whole property name is used for the dash prefix check, so you can't add the
dash character in a categorized property:

    [category]
    -property1 =

This will NOT be removed since the full property name will be `category.-property1`. Instead use the following form (outside
any category block):

    -category.property1 =

You can use this particularity to remove several keys from the same category:

    [-category]
    property1 =
    property2 =

This will remove `category.property1` and `category.property2` from the nominal configuration.
{{% /callout %}}

# Dependency injection

In a Seed application, the dependency injection is provided by a Guice injector, created by the kernel in its
starting phase. The injector is configured in explicit mode, meaning that all the application injection points
are checked during application startup and must be resolvable. This mode ensures that injection errors are detected as
soon as possible in the development process.

Although Guice is operating behind the scenes, it is invisible for the application which only needs to rely on JSR 330
annotations for defining injection points.

## Injection points

When applying the dependency injection pattern, the dependencies are passed in instead of being requested directly or
by calling factories. The process of setting dependencies into an object is called injection. In SeedStack the injections
are explicit and almost always marked with the `@Inject` annotation. The element marked with the `@Inject` annotation
is called the **injection point**.

There are multiple injection styles, described below, and they all can be used simultaneously. 

### Constructor injection

Constructor injection combines instantiation with injection. To use it, annotate the constructor with the `@Inject`
annotation. This constructor should accept class dependencies as parameters. It is then recommended to assign the
parameters to final fields in the constructor.

    public class MyServiceImpl implements MyService {
        private final OtherService otherService;
        
        @Inject
        public MyServiceImpl(OtherService otherService) {
            this.otherService = otherService;
        }
    }

If your class has no `@Inject`-annotated constructor, a public, no-arguments constructor will be used if it exists,
otherwise an exception will be thrown upon application startup.

The constructor injection style has two main benefits:

* The ability to construct injected immutable instances,
* The explicit constructor arguments will make unit testing easier: when you construct a test instance manually, you 
are still required by compiler to provide all the dependencies.     

   
### Field injection

Fields injection points are fields annotated with `@Inject` and are injected just after instance creation.

    public class MyServiceImpl implements MyService {
        @Inject 
        private OtherService otherService;
    }

Avoid using field injection with final fields, which are not guaranteed to succeed in some contexts.

### Method injection

Method injection points are methods annotated with `@Inject` are called just after field injections. Dependencies take
the form of parameters, which the injector resolves before invoking the method. Injected methods may have any number of
parameters, and the method name does not impact injection.

    public class MyServiceImpl implements MyService {
        private OtherService otherService;

        @Inject
        public void doInjection(OtherService otherService) {
            this.otherService = otherService;
        }
    }

## Injection scopes

By default, the injector returns a new instance each time it supplies a value. This behavior can be altered by applying
a scope to the implementation class. Scopes allow to reuse instances like the `@Singleton` scope which will make the
injector always return the same instance for the lifetime of the application. Annotations are used to identify scopes. 
Specify the scope for a type by applying the scope annotation to the implementation class:

    @Singleton
    public class MyServiceStatefulImpl implements MyService {
        /* everything here should be thread safe! */
    }
    
By default in SeedStack, almost every class managed by the injector has no scope associated, which means that a new
instance is created for each injection. This is a desirable behavior because it minimizes the mutability of your code and, as
such, minimizes the need to use concurrency protection (synchronized, ThreadLocal, ...). In the end, all the bugs associated
with such techniques are avoided.

In some cases, you'll need to specify a scope though:

* If an object is inherently stateful (like a counter or a cache),
* If an object is expensive to create,
* If an object is tied up to external resource.

Note that since the technical aspects that are often the motivation to implement a singleton are already handled by
the framework, it is unlikely that you will need to apply this scope yourself. Remember that by keeping your **application
code as stateless and immutable as possible** you will:

* Reduce the probability of bugs,
* Improve its scalability,
* Improve its testability.

## Static injections

Injection on static fields is a specific case of injection that requires an explicit binding that is very rarely used
in SeedStack internal code and never in application code. It means that, by default, injection on static fields of your 
classes won't be enabled. This is a good thing because static injections are difficult to test, make dependencies opaque
and rely on global state.

## Custom injections

Custom injections can be used for advanced injection behavior that is not possible to achieve through the standard 
`@Inject` injection points. They rely instead on specific annotations to trigger the injection. The `@Logging` annotation
described [here](#logging) is an example of custom injection. SeedStack doesn't rely heavily on custom injection, using
standard injection when possible.

## Method interception

To complement dependency injection, method interception is sometimes used in SeedStack. It allows to execute code each
time a *matching* method is invoked. It is suitable for cross cutting concerns ("aspects") and is notably used, among
other things, for transaction and security.

Method interception is transparent for the application code but its implementation (which works by dynamically sub-classing
and overriding matching methods) impose some limitations that you should know:
 
* Classes must be public or package-private,
* Classes must be non-final,
* Methods must be public, package-private or protected,
* Methods must be non-final,
* Instances must be created by the injector. It is not possible to use method interception on instances that aren't 
constructed by the injector.

## More information

For more information about the injector used in the Java framework, you can look at the 
[Guice documentation wiki](https://github.com/google/guice/wiki). Please note that some Guice features described
in this documentation are not available in SeedStack or implemented differently. A knowledge of Guice is **NOT**
necessary to develop a Seed-based application.

# Error diagnostic

Seed can dump diagnostic information when an exception is catched at key application locations. Core support dumps 
diagnostic information when an uncaught exception occurs in a thread but other supports can trigger dumps in various 
conditions.

Diagnostic information is an aggregation of values gathered from various diagnostic collectors in a single map. This map
is then handled by the diagnostic reporter. 

## Diagnostic collectors

A diagnostic collector is a class implementing the {{< java "org.seedstack.seed.core.spi.diagnostic.DiagnosticInfoCollector" >}} 
interface and annotated with {{< java "org.seedstack.seed.core.spi.diagnostic.DiagnosticDomain" "@" >}}:

    @DiagnosticDomain("org.my-organization.my-project.my-diagnostic-domain")
    public class MyDiagnosticCollector implements DiagnosticInfoCollector {

        @Override
        public Map<String, Object> collect() {
            ...
        }
        
    }

All diagnostic collectors are automatically detected by Seed and will be used in diagnostic information gathering. The
diagnostic domain uniquely identifies the information of the collector.

## Diagnostic reporter

The default diagnostic reporter dumps the map as a YAML document in the system temporary directory. The diagnostic 
reporter can be changed by setting the `org.seedstack.seed.diagnostic.reporter` system property to a class 
implementing {{< java "org.seedstack.seed.core.spi.diagnostic.DiagnosticReporter" >}}.
