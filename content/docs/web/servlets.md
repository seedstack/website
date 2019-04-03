---
title: "Servlet, filters and listeners"
type: "home"
zones:
    - "Docs"
sections:
    - "Manual"    
tags:
    - web
    - interfaces
menu:
    docs-manual:
        weight: 10
        parent: "web"
---

Servlets, filters and listeners can be detected and registered by SeedStack which makes them injectable and interceptable.

## Servlets

You can register a servlet by annotating your servlet class with {{< java "javax.servlet.annotation.WebServlet" "@" >}}:

```java
@WebServlet("/my-servlet")
public class MyServlet extends HttpServlet {
    ...
}
```
    
{{% callout info %}}
You can specify a priority on each listener to order them in the context initialization and destruction sequences: add a  {{< java "javax.annotation.Priority" "@" >}} annotation to the listener class with the absolute priority as value. Non-annotated listeners have a default priority of 0.
{{% /callout %}}    
    
## Filters    
    
Similarly, you can register a filter by annotating your filter class with {{< java "javax.servlet.annotation.WebFilter" "@" >}}:

```java
@WebFilter("/*")
public class MyFilter implements Filter {
    ...
}
```

{{% callout info %}}
You can specify a priority on each filter to order them in the chain filter: add a  {{< java "javax.annotation.Priority" "@" >}} annotation to the filter class with the absolute priority as value. Non-annotated filters have a default priority of 0.
{{% /callout %}}

{{% callout tips %}}
You can find the priorities of SeedStack built-in filters by looking at the {{< java "org.seedstack.seed.web.spi.SeedFilterPriority" >}} class.
{{% /callout %}}

## Listeners

Also, you can register a listener by annotating your listener class with {{< java "javax.servlet.annotation.WebListener" "@" >}}   

```java
@WebListener
public class MyListener implements ServletContextListener {
    ...
}
```
    
Any class annotated with WebListener must implement one or more of the {{< java "javax.servlet.ServletContextListener" >}}, 
{{< java "javax.servlet.ServletContextAttributeListener" >}}, {{< java "javax.servlet.ServletRequestListener" >}}, 
{{< java "javax.servlet.ServletRequestAttributeListener" >}}, {{< java "javax.servlet.http.HttpSessionListener" >}}, 
{{< java "javax.servlet.http.HttpSessionAttributeListener" >}} or {{< java "javax.servlet.http.HttpSessionIdListener" >}} interfaces.

## Disabling container scanning

**If you are running in a Web container also scanning those annotations (like Tomcat)**, you need to disable the server detection and let SeedStack do the registration. This allows to use injection and interception in servlets, filters and listeners.

To disable container scanning, add or modify the `web.xml` file under the `WEB-INF/` directory of the WAR archive. This file must have the `metadata-complete` attribute set to `true`.

Example for Servlet 3.1 level:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app
    xmlns="http://xmlns.jcp.org/xml/ns/javaee"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee http://xmlns.jcp.org/xml/ns/javaee/web-app_3_1.xsd"
    version="3.1"
    metadata-complete="true">
</web-app>    
```

   
