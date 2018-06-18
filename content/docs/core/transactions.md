---
title: "Transactions"
type: "home"
zones:
    - "Docs"
tags:
    - transactions
aliases: /docs/seed/manual/transactions    
menu:
    docs:
        weight: 7
        parent: "core"
---

SeedStack transaction management allows interactions between the application code and one or more external resource(s) to 
be done transactionally (i.e. in an all-or-nothing paradigm). <!--more--> Modules that handle effective access to transactional 
resources (like [the JPA add-on](/addons/jpa), [the JMS add-on](/addons/jms), ...) use SeedStack transaction management
described in this page.

{{% callout ref %}}
For more detail about transactions, refer to this [wikipedia page](http://en.wikipedia.org/wiki/Transaction_processing).
{{% /callout %}}

##  Local, global or no transaction ?

Transactions are a very useful tool to guarantee the consistency of application process and data. SeedStack supports two
kinds of transactions:

* **Local transactions**. As the name implies, local transactions are handled locally by the application without further
external synchronization. They only support transactional behavior on one resource at a time. Local transactions scale 
better than global ones and are simpler to manage.
* **Global transactions**. Global transactions are orchestrated through an external transactional monitor and necessitate
heavy synchronization between resources. They have the advantage to support transactional behavior across multiple
resources but they don't scale very well. They can always be replaced by explicit consistency handling in code.

{{% callout tips %}}
Unless strictly necessary we recommend to avoid global transactions. **Prefer a design capable of dealing directly with 
any consistency issue that may arise.** With such a design you can stick with local transactions or even go without 
transactions at all. In fact some persistence or messaging mechanisms don't support transactions. 
{{% /callout %}}

## The Transaction manager

The transaction manager is responsible for detecting transaction boundaries and orchestrating the transaction accordingly.
SeedStack uses [method interception](/docs/seed/dependency-injection/#method-interception) to inject behavior around methods
annotated with {{< java "org.seedstack.seed.transaction.Transactional" "@" >}}. The injected behavior is dependent upon the
{{< java "org.seedstack.seed.transaction.spi.TransactionManager" >}} implementation.

{{% callout info %}}
The {{< java "org.seedstack.seed.core.internal.transaction.LocalTransactionManager" >}} which implements local transactions
is the default transaction manager. See [configuration](#configuration) below to change it.
{{% /callout %}}

## Usage

To specify a transaction boundary, use the {{< java "org.seedstack.seed.transaction.Transactional" "@" >}} annotation along
with an companion annotation specifying the transacted resource. In the case of JPA, using the [JPA add-on](/addons/jpa),
you will write:
  
```java
public class SomeClass {
    @Inject
    private EntityManager entityManager;
    
    @Transactional
    @JpaUnit("myJpaUnit")
    public void save() throws Exception {
        entityManager.persist(new Item1("item1"));
    }
}
```  

Note that the {{< java "org.seedstack.seed.transaction.Transactional" "@" >}} and companion annotation (here `@JpaUnit`) must 
both be present. 

{{% callout warning %}}
Transactions are implemented using method interception. Beware of SeedStack 
[method interception limitations]({{< ref "docs/basics/dependency-injection.md#method-interception" >}}) when using 
transactions.  
{{% /callout %}} 

### Nominal behavior

* If no transaction is already active on the specified resource, a new transaction will be initiated before entering the method.
* If a transaction is already active on the specified resource, this transaction will be used.
* If the method exits normally (without exception), the transaction is committed.
* If any exception is thrown in the method body, the transaction is rollbacked.
 
### Annotation parameters

Transactional behavior can be altered with parameters on the {{< java "org.seedstack.seed.transaction.Transactional" "@" >}}
annotation.

#### Propagation

Wrapping a method with {{< java "org.seedstack.seed.transaction.Transactional" "@" >}} doesn't mean you always need to
open a transaction. You can change the propagation behavior with the `propagation` parameter:
 
* `REQUIRED`: uses the active transaction if any or creates a new one if none exists. **It is the default value.**
* `REQUIRES_NEW`: suspends the active transaction if any and creates a new transaction.
* `MANDATORY`: throws an exception if no active transaction is found.
* `SUPPORTS`: executes the code outside any transaction if none is active, or within the transaction if one is active.
* `NOT_SUPPORTED`: executes the code outside any transaction and suspend the current transaction if one is active.
* `NEVER`: executes the code outside any transaction and throws an exception if an active transaction is found.

#### Failure handling

By default, any exception thrown during the transaction leads to a rollback of this transaction. This behavior can be altered with the 
following parameters

* `rollbackOn`: lists exception classes that will lead to a rollback. These exceptions are propagated after the rollback.
* `noRollbackFor`: lists exception classes that will still lead to a commit (eg. the exception ignore list). Exceptions
in this list take precedence over exceptions specified in the `rollbackOn` parameter.

#### Read-only mode

Transactions can be marked as read-only by setting the `readOnly` parameter to true. Note that this acts as an hint for
optimization and is not guaranteed to be enforced. 
