---
title: "Configuration"
type: "manual"
zones:
    - "Seed"
sections:
    - "SeedCore"
tags:
    - "configuration"
    - "api"
    - "props"
    - "properties"
menu:
    SeedCore:
        weight: 20
---

SEED based applications are configured using files under the **META-INF/configuration** classpath directory with two types of configuration files:

* Usual properties files with a `properties` extension. These files must respect the `java.util.properties` standard
  specified [here](<http://docs.oracle.com/javase/6/docs/api/java/util/Properties.html#load(java.io.Reader)>). They are
  provided as a backwards compatible alternative to props files and are not detailed here.

* Advanced props files with a `props` extension. This format extends and remains compatible with the usual properties file format,
  providing a more concise and more expressive configuration language. This is the recommended way to configure your
  application and the format is described below.

You can use both types in the same application with as many files as required to produce an easily readable configuration file set. 
All files named after the two patterns specified in the previous paragraph are parsed and merge into the global application configuration.

# The props format

Full documentation is available here  : [http://jodd.org/doc/props.html](<http://jodd.org/doc/props.html>).
Following points describe the main points to be considered while using the format in a SEED based application.

## UTF-8 encoding
By default, props files are UTF-8 encoded, but can be encoded in any encoding.

## Trimming whitespaces
Leading and trailing spaces will be trimmed from section names and property names. Leading and/or trailing spaces may be trimmed from property values.

## Assignment property values
Either equal sign (=) or colon (:) are used to assign property values.

## Comments
Comments begin with either a semicolon (;), or a sharp sign (#) and extend to the end of line. It doesn't have to be the first character.

## Escaping
A backslash (`\`) escapes the next character (e.g., `\#` is a literal `#`, `\\` is a literal `\`).

## Special characters
\\uXXXX is encoded as character. Also `\t`, `\r` and `\f` are encoded as characters.

## Sections
Sections looks very much like Windows INI file sections. In props files, a section simply represents a key prefix for
following keys, until the section end or end of file. 

* Section names are enclosed between `[` and `]`. 
* Properties following a section header belong to that section. 
* Section name is added as a prefix to section properties. 
* Section ends with empty section definition `[]` or with new section start or end of file.

This example (props format) :

	# Example 1 (props format).
    [users.data]
    weight = 49.5
    height = 87.7
    age = 63
	
	[]
    comment=this is base property

is equivalent to this other one (properties format):

    users.data.weight = 49.5
    users.data.height = 87.7
    users.data.age = 63
    comment=this is base property

**In short: sections shorten and clarify properties definition.**

## Profiles

### Use

SEED provides a configuration profile concept which is activated via the `org.seedstack.seed.profiles` system property.
You can activate several profiles simultaneously by using **a comma separated list**. 
For example, following JVM argument activates both `dev` and `debug` profiles:

    -Dorg.seedstack.seed.profiles=dev,debug


### Basic definition

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

In above example, `db.port` key provides a base property that will always be available whereas other keys are dependant on a profile name (`dev` or `prod`).
Therefore, these values would be available only if the corresponding profiles (environments here) are requested through JVM `org.seedstack.seed.profiles` argument.

Since profiles can be anywhere in the key name, then section names can contain profile definitions as well. 
Above example can also be written as follows:

    db.port=3086

    [db<dev>]
    url=localhost
    username=root

    [db<prod>]
    url=productionmachine.myorganization.org
    username=securedaccount

Profile is determined at application initialization and cannot be changed afterwards. Only one profile can be active
within an application instance, therefore only properties with that active profile and base properties (without any profile)
are available through the configuration API. When no profile is configured or profile could not be determined at
application initialization, only base properties are available.

### Inner profiles

There are cases where two ore more profiles share most of their configuration and only few properties are
different (or: specific) for one profile (i.e. configuration). To avoid repeating shared properties for each profile, it
is possible to define different/scpecific properties assigned to inner profiles only. Props will first lookup keys
in inner profiles, then go up to the base level. For example :

    key1<one>=Hi!
    key2<one>=...
    ....
    key100<one>=...

    key1<one.two>=Hola!

This example defines two profiles. First one is named 'one' and contains 100 properties. Second profile is an inner
property named 'one.two'. It contains only 1 property (key1) - but all properties from its upper profile are available.

## Macros

### Simple case
A macro is a reference to some keys' value inside the value of another key. Macros are enclosed between `${` and `}`. Here is a
simple example:

    key1=Something ${foo}
    ...
    foo=nice

Value of key1 is 'Something nice'.

### Nested macros

Macros can refer to any existing property key, no matter where it is defined. THerefore, nested macros are also supported as in following example:

    key1=**${key${key3}}**
    key3=2
    key2=foo

Value of key1 is '**foo**'.

## Multiline values

Multilines values are defined with triple-quotes. Everything in-between is considered as a value. For example:

    email.body='''
        Hello $n,

        welcome!
    '''

Note that multiline values are NOT trimmed. Therefore, the value from the example will consist of 5 lines. There is no
need to escape new lines in multiline values.

## Value appending

Values with the same key name are automatically appended to each other with a comma (`,`) separator. With the following
configuration:

    org.myorganization.myproject.toto = val1
    org.myorganization.myproject.toto = val2

The `org.myorganization.myproject.toto` value evaluates to `val1,val2`. You can then retrieve this kind of value as a normal string 
or as a string array.

## Copy operator

Imagine a set of properties shared, by default, in different groups/categories as in following example:

    org.myorganization.myproject1.action1=value1
    org.myorganization.myproject1.action2=value2
    ...
    org.myorganization.myproject2.action1=value1
    org.myorganization.myproject2.action2=value2
    ...
    org.myorganization.myproject3.... # etc

Props allows you to use copy operator: `<=` in order to minimize and clarify the code required for duplication. Above props can then be written as follows:

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

Above example shows 3 different but equivalent ways to use copy operator:

* without sections
* with partial section 
* with full section

Note that copied values are set as macros, so all above copied properties are identical to:

    org.myorganization.myproject1.action1=${actions.action1}
    org.myorganization.myproject1.action2=${actions.action2}
    org.myorganization.myproject2.action1=${actions.action1}
    ....

All rules for resolving macros apply.

# Predefined values

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

# Configuration override

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

# Usage

## Declarative API

### Injecting a String
@Configuration annotation allows injecting a property on a class field. For example:

	public class MyClass {
		import org.seedstack.seed.core.api.Configuration;

		@Configuration("bar")
		private String bar; //will have the value of bar key
	}

In above code, make sure the `bar` key is valued in one of your props files. Any problem with injected configuration will throw an `Exception`
and prevent the start of the application. If the property is optional, you can set mandatory attribute to false:

    @Configuration(value = "bar", mandatory = false)

Or you can define a default value:

    @Configuration(value = "bar", defaultValue = "foo")

### Injecting a primitive or an Object primitive

Props file:

	bar = 5
	foo = false

Java code:

	@Configuration("bar")
	private int bar;

	@Configuration("foo")
	private Boolean foo;

### Injecting an array

Props file:

	bar = 1,2,3
	foo = titi, toto, tutu

Java code:

	@Configuration("bar")
	private int[] bar;

	@Configuration("foo")
	private String[] foo;

### Using a converter
You can use configuration to inject an object. To do so, you need to provide a ConfigurationConverter. Consider the
following class:

	public class StringWrapper {

		public String wrapped;

		public StringWrapper(String s){
			this.wrapped = s;
		}
	}

To inject a StringWrapper with a @Configuration annotation, we need a converter:

	public class StringWrapperConverter implements ConfigurationConverter<String>{
		
		public String convert(String value){
			return new StringWrapper(value);
		}
	}

Then inject it as follows:

	@Configuration(value = "bar", converter = StringWrapperConverter.class)
	private StringWrapper bar;

### Defining a custom error message
You can define an error message in case the property is not present and should be. First define an ErrorCode:

	public enum MyErrorCode implements ErrorCode {
	
	    MY_ERROR;
	
	}

Then create a `META-INF/errors/my.package.MyErrorCode.properties` file in your `src/main/resources` source folder as follows:

	MY_ERROR.message = The operations guys should have valued this property: ${property}
	MY_ERROR.fix = Please define this property in a props files under classpath-included META-INF/configuration directory.

You have access to the following variables with ${}:

- `property`: name of the property
- `class`: name of the error class where the configuration is required
- `field`: name of the field where the annotation is set

For example, you can define your field as follows:

	@Configuration(value = "bar", errorCodeClass = MyErrorCode.class, errorCodeName = "CONFIGURATION_ERROR")
	private String bar;
	
where `property` is the one set with `bar` key in props, `class` is MyErrorCode.class and `field` is the `bar` field initialized with `@Configuration` annotation.

## Programmatic API

If `@Configuration` annotation is not powerful enough for your needs, you can access to the configuration through
the underlying [Apache Commons Configuration](https://commons.apache.org/proper/commons-configuration/) object. 
You need to inject the Application and retrieve the Configuration object:

	@Inject
	private Application application;
	...
	Configuration conf = application.getConfiguration();
	String bar = conf.getProperty("bar");

Note that the configuration is read only and any attempt to add/remove/change a property will result in a nasty Exception. 
Full Configuration API available [here](http://commons.apache.org/proper/commons-configuration/apidocs/org/apache/commons/configuration/Configuration.html).

## Class-attached configuration

Configuration can also be attached to classes, by specifying their fully qualified names or their package names:

```
[*]
...

[org.myorganization.myapp.*]
...

[org.myorganization.mapp.mydomain1.MyEntity1]
...
```

* First section refers to all packages. Therefore properties would apply to all classes.
* Second section refers to all packages starting with `org.myorganization`. Therefore properties 
would apply to all classes within that package **and subpackages**.
* Third section refers to `org.myorganization.myapp.mydomain1.MyEntity1` 
class and would therefore only apply to this class.

If a class matches several sections, all the relevant properties are merged and attached to the class. 
To access the configuration of a specific class, you must use the `Application` interface as follows:

	@Inject
	private Application application;
	...
	Configuration conf = application.getConfiguration(MyEntity1.class);
	String bar = conf.getProperty("bar");

The `getConfiguration(Class<?>)` method will return an Apache Commons Configuration object describing configuration
attached to this class.
