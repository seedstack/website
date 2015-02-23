---
title: "Maven tools"
type: "reference"
zones:
    - "Seed"
sections:
    - "SeedWebServices"
menu:
    SeedWebServices:
        weight: 20
---

# Source folder

The WSDL file must be placed in the `META-INF/ws` directory of the classpath. 

```
src
    |-it
        |-java
        |-resources
            |-META-INF
                |-ws
    |-main
        |-java
        |-resources
            |-META-INF
                |-ws
```

# WS-import

WS-import is a tool which generates JAX-WS artifact from WSDL such as:

* Service Endpoint Interface (SEI)
* Client Service
* Exception class mapped from wsdl:fault
* JAXB generated value types (mapped java classes from schema types)

You have to use the `jaxws-maven-plugin`. The following code is a sample of WS-import configuration.

```
<build>
    <plugins>
        <plugin>
            <groupId>org.jvnet.jax-ws-commons</groupId>
            <artifactId>jaxws-maven-plugin</artifactId>
            <version>2.3</version>
            <executions>
                <execution>
                    <id>wsimport</id>
                    <goals>
                        <goal>wsimport</goal>
                    </goals>
                    <phase>generate-sources</phase>
                    <configuration>
                        <verbose>true</verbose>
                        <packageName>com.inetpsa.ws.hello</packageName> <!-- only if you want all of this WS classes in the same package -->
                        <wsdlDirectory>src/main/resources/META-INF/ws</wsdlDirectory>
                        <wsdlLocation>META-INF/ws/Hello.wsdl</wsdlLocation>
                        <wsdlFiles>
                            <wsdlFile>Hello.wsdl</wsdlFile>
                        </wsdlFiles>
                        <extension>true</extension> <!-- this flag is needed to use JMS transport -->
                        <target>2.1</target>
                        <genJWS>false</genJWS>
                    </configuration>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
```

You can find more information about jaxws-maven-plugin [here](https://jax-ws-commons.java.net/jaxws-maven-plugin/wsimport-mojo.html)


