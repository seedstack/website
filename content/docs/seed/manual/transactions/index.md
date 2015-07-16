---
title: "Overview"
type: "manual"
zones:
    - "Seed"
sections:
    - "SeedTransactions"
tags:
    - "transaction"
    - "maven"
    - "configuration"
menu:
    SeedTransactions:
        weight: 10
---

**SEED transaction management** allows interactions between the application code and one or more external resource(s) to be
done transactionally (ie. in an all-or-nothing paradigm). It is used in conjunction with other supports handling external resources 
such as **persistence** or **messaging**. For more detail about transactions, refer to this [wikipedia page](http://en.wikipedia.org/wiki/Transaction_processing).

# Maven dependency

Below snippet adds SEED transaction management to your application:

	<dependency>
		<groupId>org.seedstack.seed</groupId>
		<artifactId>seed-transaction-support</artifactId>
	</dependency>
	
**This dependency is not required when it is transitively provided by another support dependency (eg. JPA, JMS, …)**

# Transaction manager

The transaction manager is responsible for detecting transaction boundaries in the application code and wrap them with
an interceptor. This interceptor will then automatically create, commit or rollback and release a transaction when the
transactional code is invoked. The behavior of the transaction manager is heavily customizable depending on your business requirement.

## Definition

A SEED application can have **only one** transaction manager. The transaction manager is specified with following configuration property:

	org.seedstack.seed.transaction.transaction-manager = fully.qualified.name.of.TransactionManagerClass

## Local transaction manager

The local transaction manager manages transactions within the application. It cannot handle global transactions managed 
by an external transaction monitor like a J2EE Web server and doesn't support spanning transactions over multiple 
resources. However it is very lightweight and adequate for most common applications uses. This is the default transaction
manager.

	org.seedstack.seed.transaction.transaction-manager = org.seedstack.seed.transaction.internal.LocalTransactionManager

## JTA transaction manager	

The JTA transaction manager integrates code demarcated with SEED transactions with any external JTA-compliant transaction
monitor such as ones found in J2EE Web servers. To use it, just specify the following configuration property:

	org.seedstack.seed.transaction.transaction-manager = org.seedstack.seed.transaction.internal.JtaTransactionManager
	
Some supports may need additional configuration to be able to participate in a JTA transaction. 

