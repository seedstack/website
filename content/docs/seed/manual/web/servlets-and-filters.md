---
title: "Servlets and filters"
type: "manual"
zones:
    - "Seed"
sections:
    - "SeedWeb"
tags:
    - "web"
    - "filter"
    - "servlet"
    - "api"
    - "configuration"
menu:
    SeedWeb:
        weight: 20
---

A SEED application almost never requires a servlet or a filter to be configured since embedded technologies already
provide automatic declaration of required web components. When configuration is still required, there are two ways 
to custom configure servlets and filters:

* Through declarative SEED annotations (recommended),
* Directly through Guice configuration (for really advanced usage).

# Servlets and Filters

Servlet mapping is defined through `@WebServlet` annotation on your servlet class. Some attributes are the path, the
initialization parameters and the name of the servlet:


    @WebServlet(value = "/myservlet/*", initParams = { @WebInitParam(name = "param", value = "value") }, name = "my-servlet")
    public class MyServlet extends HttpServlet {
        …
    }

Filter mapping is defined through `@WebFilter` annotation on your filter class. Some attributes are the path, the
initialization parameters and the name of the filter:

    @WebFilter(value = "/myfilter/*", initParams = { @WebInitParam(name = "param", value = "value") }, name = "my-filter")
    public class MyFilter extends HttpFilter {
        …
    }

# Advanced configuration

## Servlets and Filters with Guice

**For advanced uses** with Guice-based configuration, servlet and filters can be declared in a module extending `ServletModule` as follows:

    @Install
    public class MyModule extends ServletModule {
    
        @Override
        protected void configureServlets() {
            Map<String, String> servletParams = new HashMap<String, String>();
            servletParams.put("param", "value");
            bind(MyServlet.class).in(Singleton.class);
            serve("/myservlet/*").with(MyServlet.class, servletParams);
            
            Map<String, String> filterParams = new HashMap<String, String>();
            filterParams.put("debug", "true");
            bind(MyFilter.class).in(Singleton.class);
            filter("/myfilter/*").through(MyFilter.class, filterParams);
        }
        
    }
    
**All servlets anfd filters must be configured as singletons to be compliant with the J2EE specification.**
    
## Dispatch Order

Any number of servlets and filters can be declared. They will be compared and dispatched in the specified order
according to the configuration method:

* When using annotation based configuration, absolute ordering is specified through the annotation `order` integer attribute. 
Servlet declaration order follows the ascending ordering of those integer values. Filters behave the same way with their associated ordering.
* When using guice-based configuration, servlets and filters are dispatched according to the order in which the rules appear in your module. 
When several modules declare servlets and/or filters, either manually install those modules in the right order with an aggregation module or use concern-based module ordering 
(see core support documentation for more details about this subject).

If using both kinds of configuration, servlets and/or filters ordering is defined in each of them but undetermined between the two configuration kinds.

## Annotation vs Guice configuration

In most cases annotation based configuration should be preferred. It provides a nice and clean way for declaring
 modular web components with minimal complexity. ON the other hand, Guice configuration is more powerful since it provides 
 an opportunity to wrap a servlet or a filter with any logic you want.

## Regular expressions mapping

Servlets and filters mapping is also possible with URL patterns using regular expressions:

    serveRegex("(.)*ajax(.)*").with(MyAjaxServlet.class);
    filterRegex("(.)*admin(.)*").with(MyAdminFilter.class);
    
This will map any URL containing the text "ajax" to MyAjaxServlet such as:

* http://myapplication.myorganization.org/ajax.html
* http://myapplication.myorganization.org/content/ajax/index
* http://myapplication.myorganization.org/it/is-totally-ajaxy

Similarly it will map any URL containing the text "admin" to MyAdminFilter.


