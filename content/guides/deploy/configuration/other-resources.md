Although props files can be used to externalise a lot an application configuration, you will often need to externalise
additional resources as well. This section will lead you to a better understanding of all frequently encountered resources
and if they need to be externalised. 

<div class="callout callout-info">
If you need to externalise props files, please have a look at <a href="#!/dev-guide/configuration/other-resources">this page</a>
instead.
</div>

# LDAP component configuration

The PSA LDAP component requires a `ldap.properties` file in the classpath in the default package (e.g. as a top-level
resource). To externalise this file, you have three options:
  
* Add a `ldap.properties` file in a directory that will be added to the classpath BEFORE other classpath entries and as
such will override any internal version of the file. If the classpath addition is not working as expected the application
will still pick the internal file that may point to a development or test LDAP directory. Therefore this option is 
**NOT RECOMMENDED in production**.
* Exclude `ldap.properties` from being packaged in the application. By doing this you ensure that no internally defined
LDAP directory can be picked by the LDAP component if classpath addition is not working correctly, so this option is
**RECOMMENDED in production**.

# JPA persistence.xml

JPA requires that a file named `persistence.xml` is placed under the `META-INF` directory of the classpath. This file
is purely internal to the application and shouldn't be externalised at all. To externalise the database configuration,
you have two options:

* Configure JPA to retrieve the data source through JNDI using a well defined name. You can find more information on
JPA JNDI configuration [here](#!/seed-doc/persistence/jpa#using-jndi). It is strongly discouraged to externalise the
JNDI name of the data source since this name can be used internally by the application. The JPA unit name(s) shouldn't
be externalised at all.
* Use the SEED unified configuration to specify the data source properties. Those can then be externalised using the
props externalisation mechanism described [here](#!/dev-guide/configuration/props).

