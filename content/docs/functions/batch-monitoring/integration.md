# Persistence

## Create Spring Batch metadata tables:

In order to create DB tables for Spring Batch metadata, check the schemas (schema-10g.sql oracle, schema-mysql.sql, ...) that are described in the **spring-batch-core** JAR inside **org.springframework.batch.core** pakage.

<div class="callout callout-info">
The tables <em>(BATCH _)</em> prefix can be changed but requires a definition in two places:
<ul> 
<li><code>tablePrefix</code> property within batch <code>jobRepository</code> bean configuration.</li>
<li> <code>table.prefix</code> property within props
  <code>[com.inetpsa.seed.monitoring.batch.datasource]</code> section of the Web
  appplication.</li>
</ul>
</div>

## Data source configuration 

### In batch application 

     <bean id="jobRepository" class="org.springframework.batch.core.repository.support.JobRepositoryFactoryBean">
    		<property name="dataSource" ref="dataSource" />
    		<property name="transactionManager" ref="transactionManager" />
    		<property name="databaseType" value="...."/>
    		<property name="tablePrefix" value="....." />
    	</bean>
    
    <bean id="dataSource" class="org.apache.commons.dbcp.BasicDataSource" destroy-method="close">
    		<property name="driverClassName" value="....." />
    		<property name="url" value="....." />
    		<property name="username" value="...." />
    		<property name="password" value="...." />
    	</bean>
    
    <bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
    		<property name="dataSource" ref="dataSource" />
    	</bean>


### in web application

In .props file:

	[org.seedstack.batch.monitoring.datasource]
    driver= 
    url=
    user=
    password=
    table.prefix=
    pool.size=


Example: 

	[org.seedstack.batch.monitoring.datasource]
	driver= oracle.jdbc.OracleDriver
	url=jdbc:oracle:thin:@TEST:1521:test
	user=test
	password=test
	table.prefix=BATCH_
	pool.size=6

# Security

All batch monitoring REST resources are secured with permissions. These permissions have to be bound to application [roles](#!/seed-doc/security#role) in order to allow access to the user interface.

## Read Permission:

In .props file (of your web application):

	[org.seedstack.seed.security.permissions]
	monitoring = seed:monitoring:batch:read

ConfigurationRealm example:
   	
	[com.inetpsa.seed.security.users]
    jane = password, SEED.MONITORING
    admin = password, SEED.MONITORING
    
    [com.inetpsa.seed.security.roles]
    monitoring = SEED.MONITORING
    
    [com.inetpsa.seed.security.permissions]
    monitoring = seed:monitoring:batch:read

