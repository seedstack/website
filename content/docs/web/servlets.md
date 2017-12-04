---
title: "Servlet, filters and listeners"
type: "home"
zones:
    - "Docs"
tags:
    - web
    - interfaces
menu:
    docs:
        weight: 10
        parent: "web"
---

Servlets, filters and listeners can be detected and registered by SeedStack which makes them injectable and interceptable.

You can register a servlet by annotating your servlet class with {{< java "javax.servlet.annotation.WebServlet" "@" >}}:

    @WebServlet("/myservlet/*")
    public class MyServlet extends HttpServlet {
        ...
    }
    
Similarly, you can register a filter by annotating your filter class with {{< java "javax.servlet.annotation.WebFilter" "@" >}}:

    @WebFilter("/myfilter/*")
    public class MyFilter implements Filter {
        ...
    }
    
Also, you can register a listener by annotating your listener class with {{< java "javax.servlet.annotation.WebListener" "@" >}}   

    @WebListener
    public class MyListener implements ServletContextListener {
        ...
    }
    
Any class annotated with WebListener must implement one or more of the {{< java "javax.servlet.ServletContextListener" >}}, 
{{< java "javax.servlet.ServletContextAttributeListener" >}}, {{< java "javax.servlet.ServletRequestListener" >}}, 
{{< java "javax.servlet.ServletRequestAttributeListener" >}}, {{< java "javax.servlet.http.HttpSessionListener" >}}, 
{{< java "javax.servlet.http.HttpSessionAttributeListener" >}} or {{< java "javax.servlet.http.HttpSessionIdListener" >}} interfaces.

{{% callout warning %}}
If you are running in a Web container also scanning those annotations, you need to disable the server detection to avoid 
getting an exception for duplicate registration.
{{% /callout %}}
   
