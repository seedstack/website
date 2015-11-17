---
title: "Other resources"
guide: "Make a configurable application"
author: "SeedStack"
menu:
    ConfigurationGuide:
        weight: 40
---

Although props files can be used to externalise a lot an application configuration, you will often need to externalise
additional resources as well. This section will lead you to a better understanding of all frequently encountered resources
and if they need to be externalised. 

{{% callout info %}}
If you need to externalise props files, please have a look at [this page](../props) instead.
{{% /callout %}}

# JPA persistence.xml

Seed JPA persistence support allows you to completely avoid `persistence.xml` usage and use classpath scanning instead
to discover JPA entities. But you can still use the explicit `persistence.xml` file if you wish. 

This file is located in the `META-INF` directory of the classpath. This file is purely internal to the application and 
shouldn't be externalised at all. To externalise the database configuration, you have two options:

* Configure JPA to retrieve the data source through JNDI using a well defined name. You can find more information on
JPA JNDI configuration [here](/addons/jpa#datasource-via-jndi). It is strongly discouraged to externalise the
JNDI name of the data source since this name can be used internally by the application. The JPA unit name(s) shouldn't
be externalised at all.
* Use the Seed unified configuration to specify the data source properties. Those can then be externalised using the
props externalisation mechanism described [here](../props).

