---
title: "Overview"
type: "reference"
zones:
    - "Seed"
sections:
    - "SeedSpring"
menu:
    SeedSpring:
        weight: 10
---

SEED Spring support is a bi-directional injection bridge between SEED managed instances and Spring beans. It allows to
inject Spring beans in SEED instances and SEED instances as Spring beans.

Additionally, this support fills in a gap between SEED and Spring code allowing for instance to initiate a Spring-based 
transaction from SEED code. Tt also provides a Spring namespace handler to make its features as easy to use as possible.

# Maven dependency

To add this support to your project use the following dependency snippet:

    <dependency>
        <groupId>org.seedstack.seed</groupId>
        <artifactId>seed-spring-support</artifactId>
    </dependency>

# Usage

## Spring to SEED

Any Spring context located in the `META-INF/spring` classpath directory and named with the pattern `*-context.xml` will
be autodetected by SEED. You can turn off auto detection with the following configuration property:
 
    com.inetpsa.seed.spring.autodetect = false
    
You can add custom contexts located anywhere in the classpath with the following configuration property:
    
    com.inetpsa.seed.spring.contexts = /resource/path/to/context1.xml, /resource/path/to/context2.xml

You can inject any Spring bean from contexts detected by SEED in any SEED injectable component. You can inject using the 
bean Class and the bean name: 

    @Inject @Named("theBeanId") BeanClass bean;

You can inject using the bean parent's Class (if not Object) and the bean name: 
    
    @Inject @Named("theBeanId") BeanParentClass bean;
    
You can inject using any directly implemented Interface and the bean name: 
    
    @Inject @Named("theBeanId") BeanImplementedInterface bean;

Note that you always need to qualify your injection with the bean identifier (`@Named("theBeanId")`)

## SEED to Spring 

To use SEED instances in Spring contexts, you need to add the SEED namespace to your Spring files:

    <?xml version="1.0" encoding="UTF-8"?>
    <beans xmlns="http://www.springframework.org/schema/beans" 
           xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
           xmlns:seed="http://seed.inetpsa.com/schema/spring-support"
           
           xsi:schemaLocation="
            http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-2.0.xsd
            http://seed.inetpsa.com/schema/spring-support http://seed.inetpsa.com/schema/spring-support-1.1.xsd">
    
        ...
        
    </beans>


You can then create a spring bean from any SEED instance bound with a classname:

    <seed:instance id="myService" class="com.inetpsa.prd.MyService"/>
    
It is equivalent to this SEED injection:

    @Inject
    com.inetpsa.prd.MyService myService;
    
Named SEED bindings (bound with a `@Named` qualifier) are also supported:

    <seed:instance id="myService" class="com.inetpsa.prd.MyService" qualifier="myQualifier"/>

It is equivalent to this SEED injection:

    @Inject
    @Named("myQualifier")
    com.inetpsa.prd.MyService myService;
    
Since SEED can inject Spring beans and Spring can inject SEED instances, there is a circular dependency between the two
injectors. To alleviate this problem, SEED instances are by default proxied for lazy initialization. It allows Spring to 
initialize its context without needing the SEED injector to be initialized too. You can explicitly disable this proxy:

    <seed:instance id="myService" class="com.inetpsa.prd.MyService" qualifier="myQualifier" proxy="false"/>

You can also inject configuration values directly:

    <bean id="..." class="...">
        <property name="configurationValue">
            <seed:configuration key="com.inetpsa.prd.my-configuration-value"/>
        </property>
    </bean>
    
It is equivalent to this SEED configuration injection:

    @Configuration("com.inetpsa.prd.my-configuration-value")
    String configurationValue;
    
Configuration values don't require SEED injector to be initialized and are all available at context initialization. You 
can specify a default value:

    <seed:configuration key="com.inetpsa.prd.my-configuration-value" default="myDefaultValue"/>
            
It is equivalent to this SEED configuration injection:

    @Configuration(value = "com.inetpsa.prd.my-configuration-value", defaultValue="myDefaultValue")
    String configurationValue;
    
You can control if a property is mandatory with the mandatory attribute (true by default):
    
    <seed:configuration key="com.inetpsa.prd.my-configuration-value" mandatory="false"/>
    
If no configuration value nor default value is available and the injection is not mandatory, `null` will be used. 
    