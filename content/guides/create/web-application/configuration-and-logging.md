---
title: "Configuration and logging"
type: "guide"
zones:
    - "Guides"
sections:
    - "CreateGuides"
subsections:
    - "Web application"
menu:
    CreateApplicationGuide:
        weight: 30
---

# Configuration

Take a look in you app project under `/src/main/resources/META-INF/configuration` and open the **props** file.

	[org.seedstack.seed.core]
	application-id = tut

	# Add application layer configuration here
	# clean props section
	[]

All the configuration of the seed support/functions and your application can be described here.

> Classic *properties* files are also supported. They also must be located in META-INF/configuration.

## Main features of props files

- Sections : declare a section with brackets to define a prefix for the following properties.
- Profiles : properties restricted to a profile are expressed with the `property.name<profile>` syntax. 
- Macros : a macro is a reference to another key inside a value expressed with the `${...}` syntax.

For more information, see the [documentation of the core support](/docs/seed/manual/core/configuration).

## Get a property value

Use the *@Configuration* annotation on a field of your class to get a property :

	@Configuration("org.seedstack.seed.core.application-id")
	private String applicationId; //Field will be valued with "tut"

You can define a default value for your field if no property is found.

# Logging

Preferred implementation for logging is [LOGBack](http://logback.qos.ch/ "LOGBack") which natively implements the 
SLF4J API. 

- An example of LOGBack configuration file can be found under **src/main/resources/logback.xml**.
- Use the `@Logging` annotation on a field of type of `org.slf4j.Logger` to have SEED inject the logger for the 
declaring class:


	import org.slf4j.Logger

	...
	
	@Logging
	private Logger logger;
