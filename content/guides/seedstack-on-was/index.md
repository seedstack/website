---
title: "SeedStack on WebSphere"
author: "Adrien LAUER"
date: 2018-06-12
tags:
    - web
zones:
    - Guides
noMenu: true
---

IBM WebSphere Application Server (WAS) is a complex Web application server that can pose some challenges to 
developers. The goal of this guide is to aggregate useful information about deploying SeedStack application on WAS 
successfully.<!--more-->

{{% callout info %}}
This guide applies to WAS 8.0 and above. 
{{% /callout %}}

## Minimum version

SeedStack requires at least Servlet level 3.0 which is available starting from WAS 8.0. However since SeedStack
requires Java SE 8, **it is recommended to use the last release of WAS 8.5.5**.

## Classloader

SeedStack is not JEE-based so it provides support for various Java standards (JSR), but not necessarily aligned with JEE
versions. For that reason the classloader setting in WAS should be set to **Parent last**. This allows SeedStack to use
newer versions of Java standards than the ones mandated by the server JEE level.

## Web.xml

SeedStack (starting with version 15.11.1) does not necessitate a `web.xml` file to be present under `WEB-INF`. However if
you want to use injection and interception on annotation-based servlet, filter and listener classes, you must disable container
scanning. This is done with an almost empty `web.xml` file, setting the `metadata-complete` attribute to true:

```xml
<web-app xmlns="http://java.sun.com/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://java.sun.com/xml/ns/javaee http://java.sun.com/xml/ns/javaee/web-app_3_0.xsd"
         version="3.0"
         metadata-complete="true">
</web-app>
```

## JNDI

To do a successful JNDI lookup in SeedStack, you must follow this procedure.

Declare the JNDI reference in the `web.xml` file, creating it if necessary (see above). The following example is for a
JDBC datasource:

```xml
<web-app xmlns="http://java.sun.com/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://java.sun.com/xml/ns/javaee http://java.sun.com/xml/ns/javaee/web-app_3_0.xsd"
         version="3.0"
         metadata-complete="true">
    <resource-ref>
        <description>My datasource</description>
        <res-ref-name>jdbc/TestDB</res-ref-name>
        <res-type>javax.sql.DataSource</res-type>
        <res-auth>Container</res-auth>
    </resource-ref>
</web-app> 
```

{{% callout tips %}}
For other types of JNDI resources, just change the class name in `res-type` to the correct type. You can change `res-auth`
to `Application` if the application should handle authentication to the resource. 
{{% /callout %}}

Declare the JNDI binding in the IBM-specific `ibm-web-bnd.xml` file under `WEB-INF`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-bnd 
    xmlns="http://websphere.ibm.com/xml/ns/javaee"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://websphere.ibm.com/xml/ns/javaee http://websphere.ibm.com/xml/ns/javaee/ibm-web-bnd_1_0.xsd"
    version="1.0">
        <resource-ref name="jdbc/TestDB" binding-name="jdbc/TestDB" />
</web-bnd>
```

{{% callout tips %}}
You can choose to alter the JNDI name seen from the application by changing the `name` attribute.  
{{% /callout %}}

Refer to the JNDI name bound in the previous step in SeedStack configuration:

```yaml
jdbc:
  datasources:
    myDatasource:
      jndiName: jdbc/TestDB
```

Or directly in code with an annotation:

```java
public class SomeClass {
    @Resource(name = "jdbc/TestDB")
    private DataSource myDatasource;
}
```

Or through direct lookup:

```java
public class SomeClass {
    @Inject
    private Context jndiContext;
 
    public void someMethod(){
       DataSource myDatasource = jndiContext.lookup("some/jndi/name");
    }
}
``` 

{{% callout ref %}}
For more information, read the [documentation about JNDI]({{< ref "docs/core/jndi.md" >}}).
{{% /callout %}}

## JPA

If you want to use a JPA specification version beyond what your WebSphere server support, you can do so by setting up
a {{< java "javax.persistence.spi.PersistenceProviderResolver" >}} that forces your more recent provider to be the
only JPA provider. Here is the code of a {{< java "org.seedstack.seed.spi.SeedInitializer" >}} that does this task:

```java
package org.generated.project.infrastructure.jpa;

import java.util.Collections;
import java.util.List;
import javax.persistence.spi.PersistenceProvider;
import javax.persistence.spi.PersistenceProviderResolver;
import javax.persistence.spi.PersistenceProviderResolverHolder;
import org.hibernate.jpa.HibernatePersistenceProvider;
import org.seedstack.coffig.Coffig;
import org.seedstack.seed.spi.SeedInitializer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class HibernatePersistenceProviderResolver implements PersistenceProviderResolver, SeedInitializer {
    private static final Logger LOGGER = LoggerFactory.getLogger(HibernatePersistenceProviderResolver.class);
    private final PersistenceProvider persistenceProvider = new HibernatePersistenceProvider();

    @Override
    public void afterInitialization() {
        PersistenceProviderResolverHolder.setPersistenceProviderResolver(this);
        LOGGER.info("Registered Hibernate as unique JPA provider");
    }

    @Override
    public List<PersistenceProvider> getPersistenceProviders() {
        return Collections.singletonList(persistenceProvider);
    }

    @Override
    public void clearCachedProviders() {
        // no-op
    }

    @Override
    public void beforeInitialization() {
        // no-op
    }

    @Override
    public void onInitialization(Coffig configuration) {
        // no-op
    }

    @Override
    public void afterRefresh() {
        // no-op
    }

    @Override
    public void onClose() {
        // no-op
    }
}
```

{{% callout warning %}}
SeedStack initializers are discovered by the Java Service Loader mechanism. To be discovered the class full qualified name 
must be written on its own line in a file named `META-INF/services/org.seedstack.seed.spi.SeedInitializer`:

```plain
org.generated.project.infrastructure.jpa.HibernatePersistenceProviderResolver
```
{{% /callout %}}
