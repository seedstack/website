---
title: "JDBC"
type: "manual"
zones:
    - "Seed"
sections:
    - "SeedPersistence"
tags:
    - "persistence"
    - "jdbc"
    - "datasource"
    - "configuration"
    - "jndi"
    - "transactions"
menu:
    SeedPersistence:
        weight: 30
---

Seed JDBC persistence support enables your application to interface with any relational database through the JDBC API. To
add the JDBC persistence support to your project, use the following Maven dependency:
 
    <dependency>
      <groupId>org.seedstack.seed</groupId>
      <artifactId>seed-persistence-support-jdbc</artifactId>
    </dependency>

# Configuration

You can configure the support with properties in one of your \*.props files.

Declare you list of data source names you will be configuring later:

    org.seedstack.seed.persistence.jdbc.datasources = datasource1, datasource2, ...
    
Configure each data source separately. Notice the use of the keyword *property* to specify any property that will be 
used by the datasource as specific configuration.

    [org.seedstack.seed.persistence.jdbc.datasource.datasource1]
    provider = HikariDataSourceProvider
    driver = org.hsqldb.jdbcDriver
    url = jdbc:hsqldb:mem:testdb1
    user = sa
    password =
    property.specific.jdbc.prop = value
    property.prop.for.datasource = value

If your app server declares a JNDI datasource:

    [org.seedstack.seed.persistence.jdbc.datasource.datasource2]
    jndi-name = java:comp/env/jdbc/my-datasource
    context = ...
    
The `context` property is optional and can be used to specify a specifc context name configured in 
[Core support](../../core/JNDI) to make the lookup.   
    
# JDBC Connection

The following examples show how to get a JDBC connection. 
    
    public class MyRepository {

        @Inject
        private Connection connection;

        public void updateStuff(int id, String bar){
            try{
                String sql = "INSERT INTO FOO VALUES(?, ?)";
                PreparedStatement statement = connection.prepareStatement(sql);
                statement.setInt(1, id);
                statement.setString(2, bar);
                statement.executeUpdate();
            } catch(SqlException e){
                throw new SomeRuntimeException(e, "message");
            }
        }
    }
    
Any interaction with this connection will have to be realized inside a **transaction**. Refer to the [transaction support
documentation](../../transactions) for more detail. Below is an example using the annotation-based transaction 
demarcation (notice the data source name in `@Jdbc` annotation).

    public class MyService {

        @Inject
        private MyRepository myRepository;

        @Transactional
        @Jdbc("datasource1")
        public void doSomethingRelational() {
            myRepository.updateStuff(1, "bar");
        }
    }

{{% callout info %}}
Note that the `@Jdbc` annotation is optional if you have only one transactional support in your application AND if you
only have one datasource. If you happen to be in this situation, we still recommend to explicitly specify the annotation 
to avoid doing so when the project evolves down the road.
{{% /callout %}}

# DataSource providers

When using a non JNDI datasource, we recommend the use of pooled datasource through a DataSourceProvider defined in the 
configuration. Three DataSource providers are currently supported out-of-the-box:


* [HikariCP](http://brettwooldridge.github.io/HikariCP/) with `HikariDataSourceProvider`
* [Commons DBCP](http://commons.apache.org/proper/commons-dbcp/) with `DbcpDataSourceProvider`
* [C3P0](http://www.mchange.com/projects/c3p0/) with `C3p0DataSourceProvider`

We also provide a test oriented DataSource that gives connection directly from the driver. Use `PlainDataSourceProvider` 
or do not specify a provider. In case you want to use another data source, you can create your own `DataSourceProvider` 
by implementing the `DataSourceProvider` interface:

    public class SomeDataSourceProvider implements DataSourceProvider {
    
        @Override
        public DataSource provideDataSource(String driverClass, String
                url, String user, String password, Properties jdbcProperties) {
            SomeDataSource sds = new SomeDataSource();
            sds.setDriverClass(driverClass);
            sds.setJdbcUrl(url);
            sds.setUser(url);
            sds.setPassword(user);
            sds.setProperties(jdbcProperties);
            return sds;
        }
    
    }
    
You will be able to declare it in your configuration as `SomeDataSourceProvider` (the simple name of your class). Note 
that if you want to use one of the three datasource providers described above, you will have to add the corresponding 
dependency to your project.
