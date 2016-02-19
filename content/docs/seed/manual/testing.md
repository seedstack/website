---
title: "Testing"
type: "home"
zones:
    - "Seed"
sections:
    - "SeedManual"
menu:
    SeedManual:
        weight: 20
---

Seed offers various tools to facilitate the writing of your tests in the `seed-testing` module, notably a JUnit test runner
for integration testing. This runner handles kernel startup and shutdown as well as injection of test classes. It can also
detect and activate Seed test plugins which augment the test behavior. For instance the Seed security test plugin can
login a predefined user based on an annotation.

To use Seed testing tools, add the `seed-testing` module in your test classpath. {{< dependency g="org.seedstack.seed" a="seed-testing" s="test" >}}

# Supported test typologies

Seed testing tools are based upon the popular [JUnit](http://junit.org/) testing framework. 

## Unit tests

The purpose of unit tests is to take a small and testable part of a program, isolate it from any dependency (injection, 
databases, network, file system, ...) by mocking them and check whether it behaves exactly as expected. The main goal is 
to validate code quality and reliability. 

Seed doesn't help much when writing unit tests beyond packaging a few high-quality test libraries, such as 
[AssertJ](http://joel-costigliola.github.io/assertj/) or [Mockito](http://mockito.org/).

## Integration tests

The purpose of integration tests is to pick multiple components together and test them as a whole. Integration tests can 
range from a testing a simple operation involving two classes to an entire application setup with all its dependencies 
(databases, file system, network, ...). 

Their main goal is to detect issues appearing when components interact with each other. Integration tests can be 
used to validate technical behavior, such as the correct operation of a group of components, or can extend beyond to verify 
the global program behavior in regard to functional expectations. In this latter case, it is often useful to supplement
Seed testing tools with a framework for Behavior-Driven-Development (BDD) like [JBehave](http://jbehave.org/).

# Simple integration tests

When a Web container is not required, you can simply use the {{< java "org.seedstack.seed.it.SeedITRunner" >}} JUnit runner on your
test class. Alternatively you can also extend the {{< java "org.seedstack.seed.it.AbstractSeedIT" >}} class:

	public class MyComponentIT extends AbstractSeedIT {
		@Inject
		MyService myService;
	
		@Test
		public void my_service_is_injectable() {
			Assertions.assertThat(myService).isNotNull();
		}		
	}
	
In this example:	
	
* The test class itself is instantiated by Seed injector and benefit from dependency injection and AOP interception. 	
* A different kernel is used for each test class. All test methods within a test class are invoked in the context 
of its kernel. After all test methods are completed, the kernel is shutdown. This behavior can be altered manually or 
automatically by test plugins.

{{% callout tips %}}
Simple integration tests run faster than Web integration tests are simpler to maintain. They should be preferred when 
Web testing is not necessary and be supplemented with the minimal amount of Web integration tests.
{{% /callout %}}

## Altering kernel mode

...

## Testing with security

...

## Testing command-line applications

...

# Web integration tests
	
Seed provides an [Arquillian](http://arquillian.org/) integration for Web application testing. These kind of integration
tests allow to programmatically define the deployed Web archive (WAR) and test it either from server-side or from client-side.
You can use the {{< java "org.jboss.arquillian.junit.Arquillian" >}} runner directly on your test class. Alternatively you can extend 
the {{< java "org.seedstack.seed.it.AbstractSeedWebIT" >}} class:
     
	public class MyComponentIT extends AbstractSeedWebIT {
	
	}

To specify the deployed artifact, declare a public static method annotated with {{< java "org.jboss.arquillian.container.test.api.Deployment" "@" >}}
that returns a {{< java "org.jboss.shrinkwrap.api.spec.WebArchive" >}} class:
      
	public class RestIT extends AbstractSeedWebIT {
		@Inject
		MyService myService; 
	
		@Deployment
		public static WebArchive createDeployment() {
			return ShrinkWrap
				.create(WebArchive.class)
				.addAsResource(
					"my-conf.props", 
					"META-INF/configuration/my-conf.props"
				);
		}
		
		@Test
		public void my_service_is_injectable() {
			Assertions.assertThat(myService).isNotNull();
		}
		
		@RunAsClient
		@Test
		public void my_rest_resource_is_working(@ArquillianResource URL baseURL) {
			expect().statusCode(200).when().get(baseURL.toString() + "rest/my-resource");
		}		
	}

In this example:

* The test class itself is NOT instantiated by Seed injector and, as such, cannot benefit from AOP interception. It benefits
from dependency injection though.
* The kernel is started via the Web application listener, automatically registered (no need for a `web.xml` file although one can be specified). A unique kernel is used for all test methods. This behavior cannot be altered. 
* The first test method, named `my_service_is_injectable()`, is a server-side test. It can test if injected dependencies,
like a service of the Web application here, are working correctly. 
* The second test method, named `my_rest_resource_is_working()`, is a client-side test. It is executed in a separate 
thread and can invoke the deployed Web application through the URL provided by the 
`@org.jboss.arquillian.test.api.ArquillianResource` annotated parameter. 

{{% callout info %}}
[Apache Tomcat](http://tomcat.apache.org/) is the default test server configured. You can override this choice by specifying
a custom `arquillian.xml` file at the root of the classpath. Arquillian provides many more features than described in
this section. For more information about Arquillian, visit the [official website](http://arquillian.org/). 
{{% /callout %}}

# Maven settings

It is often useful to separate integration tests and unit tests into different source folders. If you use Maven your can
do so by adding the following configuration to your project root `pom.xml`:

	<build>
	  <testResources>
		<testResource>
		  <directory>src/it/resources</directory>
		</testResource>
		<testResource>
		  <directory>src/test/resources</directory>
		</testResource>
	  </testResources>
	  <plugins>
		<plugin>
		  <groupId>org.apache.maven.plugins</groupId>
		  <artifactId>maven-failsafe-plugin</artifactId>
		  <version>${maven-failsafe-plugin.version}</version>
		  <executions>
			<execution>
			  <id>execute-integration-tests</id>
			  <phase>integration-test</phase>
			  <goals>
				<goal>integration-test</goal>
			  </goals>
			</execution>
			<execution>
			  <id>verify-integration-tests</id>
			  <phase>verify</phase>
			  <goals>
				<goal>verify</goal>
			  </goals>
			</execution>
		  </executions>
		</plugin>
		<plugin>
		  <groupId>org.codehaus.mojo</groupId>
		  <artifactId>build-helper-maven-plugin</artifactId>
		  <version>${build-helper-maven-plugin.version}</version>
		  <executions>
			<execution>
			  <id>add-it-sources</id>
			  <phase>generate-test-sources</phase>
			  <goals>
				<goal>add-test-source</goal>
			  </goals>
			  <configuration>
				<sources>
				  <source>src/it/java</source>
				</sources>
			  </configuration>
			</execution>
		  </executions>
		</plugin>
	  </plugins>
	</build>
