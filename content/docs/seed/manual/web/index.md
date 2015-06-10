---
title: "Web overview"
type: "manual"
zones:
    - "Seed"
sections:
    - "SeedWeb"
tags:
    - "web"
    - "servlet"
    - "filter"
    - "maven"
menu:
    SeedWeb:
        weight: 10
---

# What to expect

SEED web support allows you to completely eliminate application web.xml **configuration** and take advantage of annotation
based servlet and filter declaration. It ties together dependency injection and web components, meaning that your
servlets and filters can benefit from:

* Injection
* Type-safe configuration
* Modularization of servlet and filters (even if your container doesn't support web fragments)
* Aspect Oriented Programming
* …while still benefitting from the standard servlet lifecycle!

SEED web support provides integration with the Java Servlet specification and offers various Web related features. The
execution container should at least provide a Servlet 2.5 compliance level but some features are only available at
Servlet 3.0 compliance level.

# Getting SEED Web support

To add SEED Web support to your Web module, use the following dependency snippet:

    <dependency>
        <groupId>org.seedstack.seed</groupId>
        <artifactId>seed-web-support-core</artifactId>
    </dependency>
    
As previously stated, there is no need for configuring web.xml anymore but a minimal web.xml file is still required to make the web container start your SEED application:

    <?xml version="1.0" encoding="UTF-8"?>
    <web-app version="2.5" xmlns="http://java.sun.com/xml/ns/javaee"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://java.sun.com/xml/ns/javaee http://java.sun.com/xml/ns/javaee/web-app_2_5.xsd">

        <filter>
            <filter-name>guiceFilter</filter-name>
            <filter-class>com.google.inject.servlet.GuiceFilter</filter-class>
        </filter>

        <filter-mapping>
            <filter-name>guiceFilter</filter-name>
            <url-pattern>/*</url-pattern>
        </filter-mapping>
    
        <listener>
            <listener-class>org.seedstack.seed.web.ServletContextListener</listener-class>
        </listener>
    
    </web-app>
    
Note that this minimal web.xml file can be augmented with any other standard web component, which will function as
normal without any of the benefits mentioned above.

