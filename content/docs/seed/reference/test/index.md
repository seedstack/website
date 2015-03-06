---
title: "Overview"
type: "reference"
zones:
    - "Seed"
sections:
    - "SeedTest"
tags:
    - "test"
    - "maven"
menu:
    SeedTest:
        weight: 10
---

Seed offers various tools to develop or enrich your tests. In this section you will find the general-purpose testing
tools (like testing libraries or test runners) but Seed also provides specific testing tools for some supports. They
are described in their own page of the corresponding reference documentation.

# Unit tests

The purpose of unit testing is to take a small testable part of a program, isolate it from any dependency
(class injection, context, databases, network, file system …) by mocking them and check whether it behaves 
exactly as expected. The main goal is to validate code quality and the performance of a module.

# Integration tests

The purpose of integration testing is to take combined components and test them as a group.
Integration tests can test from a simple operation involving two classes to an entire application 
setup with all its dependencies (databases, file system, network …). 

Their main goal is to find and fix issues appearing with components interactions. The relevance of integration tests is either 
technical (eg. testing a service create/read/update/delete methods) or functionnal (use cases). This last approach is more 
adapted to avoid behavior regressions from a client perspective. 

# Projects' setting

Integration and unit tests belong to different source folders. To get a clean folders hierarchy in your project, 
add the following configuration to your pom.xml:

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

