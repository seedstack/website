# Configuration

Take a look in you app project under **/src/main/resources/META-INF/configuration** and open the **props** file with the classic text editor.

	[com.inetpsa.seed.core]
	application-id = tut

	# Add application layer configuration here
	# clean props section
	[]

All the configuration of the seed support/functions and your application can be described here.

> Usual *properties* files are still supported.

## Main functionalities of props

- Sections : declare a section with brackets to define a prefix for the following properties.
- Profiles : properties defined with a profile are given when the profile is active (dev, preprod, prod...).
- Macros : a macro is a reference to another key inside a value.

For more information, see the [documentation of the core support](#!/seed-doc/core/configuration "documentation of core support").

## Get a property value

Use the *@Configuration* annotation on a field of your class to get a property :

	@Configuration("com.inetpsa.seed.core.application-id")
	private String applicationId; //Field will be valued with "tut"

You can define a default value for your field if no property is found.

# Logging

Preferred implementation for logging is [LOGBack](http://logback.qos.ch/ "LOGBack") which implements SLF4J API. 

- An example of LOGBack configuration file is found under **src/main/resources/logback.xml**.
- Use the `@Logging` annotation on a field of type `Logger` to have SEED inject the logger for your class:

```
import org.slf4j.Logger
...

@Logging
private Logger logger;
```