---
title: "Configuration"
type: "home"
zones:
    - "Seed"
sections:
    - "SeedEssentials"
tags:
    - essentials
menu:
    SeedEssentials:
        weight: 30
---

SeedStack provides a simple and powerful configuration system. Configuration can be read from multiple sources and in 
multiple formats. The recommended way to specify configuration is a [YAML](https://en.wikipedia.org/wiki/YAML) file 
named `application.yaml` located at the root of the classpath.<!--more--> 

# Usage

## Sample

Consider the following Java class:

```java
@Config("someConfig")
public class MyConfig {
    @NotBlank
    private String string = "defaultValue";
    private int[] array;
    private InnerConfig object = new InnerConfig();
    
    public static class InnerConfig {            
        private List<String> list = new ArrayList<>();
    }
}
```

This can be mapped from the following `application.yaml` file:

```yaml
someConfig:
  string: Hello World!
  array: [1, 2, 3]
  object:
    list: [iris, jasmine, kiwi]
```
       
## Injection

To inject configuration objects, use the {{< java "org.seedstack.seed.Configuration" "@" >}} annotation:

```java    
public class SomeClass {
    @Configuration
    private MyConfig myConfig;
}
```

This will map the global configuration to an instance of the `MyConfig` class and inject it into the field. You can
specify the following parameters on the annotation:

* `value`: this string can be used to specify the path of the configuration node to map. If a {{< java "org.seedstack.coffig.Coffig" >}}
annotation is present on the mapped class, the path can be omitted.
* `mandatory`: if true, an exception will be thrown when the configuration node is missing; if false the behavior
will depend upon the parameter below.
* `injectDefault`: only applies when the configuration node is missing and `mandatory` is false. If true a default 
value will be injected; if false the field will be left as-is allowing to customize the default value.

Note that you can map tree nodes , without defining configuration classes:

```java
public class SomeClass {
    @Configuration("someConfig.string")
    private String someString; // will be "Hello World!"
    
    @Configuration("someConfig.array[1]")
    private int someInt; // will be 2
    
    @Configuration(value = "someConfig.object.list[1]", mandatory = true)
    private String otherString; // will be "jasmine"
    
    @Configuration(value = "unknownProperty", injectDefault = false)
    private String defaultValue = "default"; // will be "default"
}
```

## Programmatic API

To access the configuration programmatically, inject the {{< java "org.seedstack.seed.Application" >}} class and use 
the `getConfiguration()` method. This will return a {{< java "org.seedstack.coffig.Coffig" >}} instance that is the API 
facade of the configuration system:

```java
public class SomeClass {
    @Inject
    private Application application;
    
    public void someMethod() {
        Coffig coffig = application.getConfiguration();
        
        // will be the fully mapped POJO
        MyConfig myConfig = coffig.get(MyConfig.class, "someConfig");
        
        // will be "Hello World!"
        String someString = coffig.get(String.class, "someConfig.string");   
        
        // will be 2
        int someInt = coffig.get(int.class, "someConfig.array[1]");        
        
        // will be "jasmine"
        String otherString = coffig.getMandatory(String.class, 
                                                 "someConfig.object.list[1]"); 
        
        // will be "default"
        String defaultValue = coffig.getOptional(String.class, "unknownProperty")
                                    .orElse("default"); 
    }
}
```

## Class configuration

It is possible to assign configuration properties to classes, individually or by package. The top-level tree node must
be named `classes`. Below that, each node having a value will denote a configuration property at its level in the package
hierarchy. Consider this example:    
  
```yaml
classes:
  org:
    myorg:
      myapp:
        appLevelProperty: value1
        domain:
          packageLevelProperty: value2
          model:
            SomeModelClass:
              classLevelProperty: value3
``` 

You can obtain the configuration properties assigned to a class by using the {{< java "org.seedstack.seed.Application" >}}
interface:

```java
public class SomeClass {
    @Inject
    private Application application;
    
    public void someMethod() {
        ClassConfiguration<SomeModelClass> classConfig = 
            application.getConfiguration(SomeModelClass.class);
        
        // will be 'value1' 
        classConfig.get("appLevelProperty");     

        // will be 'value2' 
        classConfig.get("packageLevelProperty");

        // will be 'value3' 
        classConfig.get("classLevelProperty");
    }
}
```

* Class configuration properties are cumulative from the top package to the class level.
* Specific properties (lower-level) override general (higher-level) properties with the same name.

# Mapping

The following mapping rules apply:

* **Fields are mapped by name** from configuration nodes. 
* **When a setter is present for the field, it is used** instead of direct field access.
* **When a configuration node is missing for a field, the field is left untouched**. This can be used to specify default values. 
* If a {{< java "org.seedstack.coffig.Config" "@" >}} annotation is specified on the mapped class, it is used as the default
path prefix. 

The following types can be mapped directly from configuration nodes:
 
* Values (primitive or objects)
* Strings
* Arrays
* Lists 
* Sets
* Maps 
* Enums 
* Optionals 
* URIs/URLs
* Properties 
* Classes

Types that don't have a direct mapping (i.e. not in the list above) are mapped by recursively mapping their individual 
fields. The example at the top of the page is mapped like this:

* The `MyConfig` class cannot be mapped directly, so its fields will be enumerated and mapped individually.
* The `string` and `array` fields are mapped directly.
* The `InnerConfig` class cannot be mapped directly, so its fields will be enumerated and mapped individually.
* The `list` field can be mapped directly.
* The items of the list can be mapped directly.

{{% callout tips %}}
The mapping takes into account the full type of the field, **including generics**. As such it is possible to properly
map complex types like:
 
* `List<URL>`,
* `Class<? extends SomeInterface>`,
* or even `Optional<Map<String, List<SomeEnum>>>`.
{{% /callout %}}
 
# Validation
 
[Bean validation 1.1](http://beanvalidation.org/) annotations can be put on fields mapped by the configuration system.
The constraints will be automatically checked after mapping. If a constraint is violated a {{< java "org.seedstack.coffig.ConfigurationException" >}}
will be thrown with the details.
 
# Profiles
 
One or more configuration profiles can be attached to any configuration node with the following syntax:
  
```yaml
someConfig:
    someProperty<profile1>: value1
    someProperty<profile2,profile3>: value2
otherConfig<profile3>:
    otherProperty: value3
```    

You can activate one or more configuration profile at application startup by specifying them in the `seedstack.profiles`
system property:

```bash
java -Dseedstack.profiles="profile2,profile3" ...
```

Considering the example above, if you activate `profile1`, the resulting configuration will be:

```yaml
someConfig:
    someProperty: value1
```  

If you activate `profile2` and `profile3`, the resulting configuration will be:

```yaml
someConfig:
    someProperty: value2
otherConfig:
    otherProperty: value3
```  
 
# Macros
 
Macros are references to other nodes in the global configuration tree and are replaced by the value of the referenced 
node. Macros use the `${}` syntax:
  
```yaml
name: World
message: Hello ${name}!
```  

## Evaluation

In the example above, the node `message` will be evaluated to "Hello World!". Note that the macro must specify the full 
path of the referenced node.

A macro is evaluated each time the containing node is mapped. This means that if the referenced node has been modified, 
the node containing the macro will change accordingly.
 
A macro is evaluated recursively so it can reference a node containing another macro and so on.
 
## Escaping

Macro resolution can be avoided by escaping the dollar sign with a backslash: `Hello \${name}!` will be evaluated to "Hello ${name}!".

## Nesting

Macros can be nested:

```yaml
names: [ John, Jane ]
index: 1
message: Hello ${names[${index}]}!
```  

The `message` node will be evaluated to "Hello Jane!".

## Default value

If a macro references a non-existing node, it will be evaluated to an empty string. A macro can have a default value 
that can be a quoted string or another node reference.

```yaml
name: World
message1: Hello ${name}!
message2: Hello ${foobar}!
message3: Hello ${foobar:'Robert'}!
message4: Hello ${foobar:name}!
```  

* The `message1` node will be evaluated to "Hello World!".
* The `message2` node will be evaluated to "Hello !".
* The `message3` node will be evaluated to "Hello Robert!".
* The `message4` node will be evaluated to "Hello World!".

# Function calls

Function calls allow to call predefined Java methods from configuration nodes. Function calls use the `$fn()` syntax:

```yaml
symbols: [ '!', '.', '?' ]
message: $greet('World', symbols, 0)
```  

The `greet` function is implemented as a method annotated with {{< java "org.seedstack.coffig.spi.ConfigFunction" "@" >}}
in a class implementing {{< java "org.seedstack.coffig.spi.ConfigFunctionHolder" >}}:

```java
package org.seedstack.samples.config;

public class GreetFunctionHolder implements ConfigFunctionHolder {
    private Coffig coffig;
    
    @Override
    public void initialize(Coffig coffig) {
        this.coffig = coffig;
    }

    @ConfigFunction
    private String greet(String name, String[] symbols, int index) {
        return String.format("Hello %s %s", name, symbols[index]);
    }
}
```

The `GreetFunctionHolder` class must be registered with the Java [ServiceLoader](https://docs.oracle.com/javase/8/docs/api/java/util/ServiceLoader.html) mechanism,
with the following file:

```plain
src/main/resources
    └ META-INF
        └ services
            └ org.seedstack.coffig.spi.ConfigFunctionHolder
```

containing:

```plain
org.seedstack.samples.config.GreetFunctionHolder
```

{{% callout warning %}}
The holder is not injectable because it is possible for configuration functions to be called before the injector is ready.
You must implement your functions in a way that doesn't rely on injection.
{{% /callout %}}

## Evaluation

In the example above, the node `message` will be evaluated to "Hello World!". Parameters are automatically mapped to their
Java type, allowing to pass complex objects to configuration functions. String literals can be passed as parameters by
enclosing them with single quotes. Parameters that reference other nodes must specify their full path.
 
## Escaping

Function calls can be avoided by escaping the dollar sign with a backslash: `\$greet('World', symbols, 0)` will be 
evaluated to "$greet('World', symbols, 0)".

## Nesting

Parameters can be other functions calls: `$greet('World', $getSymbols(), 0)` will use the return value of the `getSymbols()` 
function call as second parameter.

# Sources

Configuration is read from multiple predefined sources, merged into a unique global configuration tree. 

## Base

Base configuration is read from an `application.yaml` file at the root of the classpath:

```plain
src/main/resources
    └ application.yaml
```

Base configuration is the easiest way of specifying configuration and should be enough for most applicative needs. 
If multiple JAR files or classpath directories contain an `application.yaml` file, they are all merged together in 
an undefined order. 

## Auto-discovered

Auto-discovered configuration is read from `*.yaml` files discovered under the `META-INF/configuration` classpath location:
 
 ```plain
 src/main/resources
     └ META-INF
         └ configuration
            ├ file1.yaml
            ├ file2.yaml
            └ ...         
 ```
 
Auto-discovered configuration is useful to embed configuration in reusable modules as it will be automatically discovered
and merged into the global configuration when this module is used. There is no restriction on file names. 

Auto-discovered configuration has a lower precedence than base configuration and can be overridden by it.  

## Command-line

Command-line configuration is gathered from system properties prefixed by `seedstack.config`:

    java -Dseedstack.config.someConfig.string=someValue -jar app.jar
    
This will define the following configuration tree:

```yaml
someConfig:
    string: someValue
```
        
Command-line configuration has a higher precedence than base configuration and will override it.  
        
## Environment variables
         
Environment variables configuration is gathered from all environment variables and put under the `env` node:

```yaml
env:
    ENV_VARIABLE_1: value1
    ENV_VARIABLE_2: value2
    ...
```

Environment variables have the maximum precedence and cannot be overridden.  
        
## System properties
         
System properties configuration is gathered from all Java system properties and put under the `sys` node:

```yaml
sys:
    file.encoding: UTF-8
    some.system.property: value1
    some.other.system.property: value2
    ...
```

System properties have the maximum precedence and cannot be overridden.
  
{{% callout warning %}}
Some default system properties (like `java.vendor`) have a value and simultaneously serve as prefix for other keys (like
`java.vendor.url`). This cannot be mapped as a valid configuration tree, so they are mapped as flat properties under the 
`sys` node. You must escape the property dots with a backslash (`\`) when specifying the path to such keys. 

In this example, you can access the `file.encoding` property with the `sys.file\.encoding` path.
{{% /callout %}}
         
## Priority
         
The priority order of the sources is, from highest to lowest:

* System properties,
* Environment variables,
* Command-line configuration,
* Base configuration,
* Auto-discovered configuration.
         
# Override
         
Any configuration file can be overridden by adding the "override" word in its name before the extension:

* Any node inside an `application.override.yaml` file can override any node inside an `application.yaml` file,
* Any node inside a `META-INF/configuration/*.override.yaml` can override any node inside a `META-INF/configuration/*.yaml`
file.
          
{{% callout tips %}}
You can use this feature to override configuration in tests. The easiest way to do this is to add an `application.override.yaml`
at the root of your test classpath. 
{{% /callout %}}          

# Formats

## YAML

Any configuration file can be in the [YAML format](https://en.wikipedia.org/wiki/YAML). The files can use the `yaml` or 
the `yml` extension indifferently. 

{{% callout info %}}
This is the preferred configuration format.
{{% /callout %}}

## JSON 

Any configuration file can also be in [JSON format](https://en.wikipedia.org/wiki/JSON), by using the `json` extension 
instead. The same rules apply to YAML and JSON files. 

## Properties

Any configuration file can also be in [Properties format](https://docs.oracle.com/javase/8/docs/api/java/util/Properties.html),
by using the `properties` extension instead. 

{{% callout info %}}
Dot-delimited properties are mapped hierarchically. For instance the following properties file:

```properties
test.key1=value1
test.key2=value2
```

Is equivalent to the following YAML file:

```yaml
test:
    key1: value1
    key2: value2
```

**One important side-effect is that you cannot give a value to a property already used as a prefix of another property.**
In this example, the `test` property cannot be given any value since it cannot be both parent and leaf at the same time
in the resulting tree.
{{% /callout %}}

{{% callout warning %}}
Properties files only support string values. Other data types, such as numbers, booleans, arrays or lists are not supported and
must be parsed manually. 
{{% /callout %}}

# Tooling

{{% callout info %}}
For more information about the tool mode, see [this page](manual#run-in-tool-mode).
{{% /callout %}}

## Configuration options dump

To dump the all the configuration options available in your project you can execute the [config goal](/docs/overview/maven-plugin/config) 
of the SeedStack Maven plugin:

```bash
mvn -q seedstack:config
```
    
This executes the `config` tool on your project and dump a tree of all configuration options with their type and 
description. The `-q` disables all non-error Maven logs to clean the output. You can ask for details about a specific leaf
in the configuration tree:

```bash
mvn -q -Dargs="application.basePackages" seedstack:config
```

This displays the detailed description of the `application.basePackages` configuration node.

## Effective configuration

To dump the configuration effectively scanned, parsed and aggregated by SeedStack you can execute the [effective-config goal](/docs/overview/maven-plugin/effective-config)
of the SeedStack Maven plugin:

```bash
mvn -q seedstack:effective-config
```

This executes the `effective-config` tool on your project and produce a YAML dump of the aggregated configuration as seen
by the application. The `-q` disables all non-error Maven logs to clean the output.

You can execute the plugin [effective-test-config goal](/docs/overview/maven-plugin/effective-test-config) to display
the test configuration instead of the main one:

```bash
mvn -q seedstack:effective-test-config
```

This takes into account the test classpath to build the configuration tree.
