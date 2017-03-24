---
title: "Finders"
type: "home"
zones:
    - "Business"
sections:
    - "BusinessManual"
tags:
    - "query"
    - "pattern"
    - "data"
    - "finder"
menu:
    BusinessManual:
        weight: 90
---

{{% callout def %}}
**A finder encapsulates interface-specific data queries that have no business meaning.<br>
It only has read-only operations.**
{{% /callout %}}

# Characteristics

## Not a repository

A finder has a different purpose than a repository:
 
* The repository is responsible for domain persistence operations that are meaningful to the business. Domain objects
can then be transformed into DTO by using [assemblers]({{< ref "docs/business/manual/assemblers.md" >}}).
* The finder is useful when you need to retrieve raw data, bypassing the domain to directly produce an interface-specific DTO.

## Can use any persistence mechanism

A finder can retrieve data from anywhere regardless of the persistence mechanism:
 
* A database,
* A fulltext index,
* A distributed cache,
* A data structure server,
* The filesystem,
* etc...

## Read-only

As the finder bypasses the domain model, **it must be restricted to read-only queries** to avoid the risk of compromising the
integrity of the system.

# Declaration
 
To create a finder with the business framework, create an interface annotated with {{< java "org.seedstack.business.finder.Finder" "@" >}}:

```java
@Finder
public interface SomeFinder {
    SomeDTO findSomeData(String filter);
}
```

{{% callout info %}}
This interface belongs to the interface layer and should be placed in same package as the DTO it produces.
{{% /callout %}}

Then create its implementation, specific to a persistence technology. In the case of a JPA finder:

```java
public class SomeJpaFinder implements SomeFinder {
    @Override
    public SomeDTO findSomeData(String filter) {
        // directly use JPA to retrieve raw data and produce the DTO
    }
}
```

{{% callout warning %}}
Your finder implementation will always depend upon a specific persistence technology, so put it in the infrastructure layer
in a sub-package named after the corresponding technology.
{{% /callout %}}

{{% callout tips %}}
If you need to have multiple implementation of a finder, you can apply a different [injection qualifier]({{< ref "docs/business/qualified-injection.md" >}}) 
on each implementation. 
{{% /callout %}} 

# Usage

To use your finder, simply [inject it]({{< ref "docs/seed/dependency-injection.md" >}}) where required: 

```java
public class SomeClass {
    @Inject
    private SomeFinder someFinder;
    
    public void someMethod() {
        someFinder.findSomeData("someFilter");        
    }
}
```

{{% callout info %}}
By default, services are instantiated each time they are injected, avoiding the risk to wrongly keep an internal state 
between uses. In some cases, after having well considered the issue, you can choose to make your service a singleton by
annotating the service implementation with {{< java "javax.inject.Singleton" "@" >}}.
{{% /callout %}}


# Example

## Finder interface

Notice the usage of {{< java "org.seedstack.business.finder.Result" >}} and {{< java "org.seedstack.business.finder.Range" >}} 
to paginate the results.

```java
@Finder
public interface ProductRepresentationFinder {

    Result<ProductRepresentation> findProductsFromCategory(Range range, long categoryId);

    Result<ProductRepresentation> findProducts(Range range, String filter);

}
```

## Finder JPA implementation

```java
public class ProductRepresentationJpaFinder implements ProductRepresentationFinder {
    private final EntityManager entityManager;

    @Inject
    public ProductRepresentationJpaFinder(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    public Result<ProductRepresentation> findProductsFromCategory(Range range, long categoryId) {
        return new Result<>(computeResultList(range, null, categoryId), range.getOffset(), computeFullRequestSize(null, categoryId));
    }

    @Override
    public Result<ProductRepresentation> findProducts(Range range, String filter) {
        return new Result<>(computeResultList(range, filter, null), range.getOffset(), computeFullRequestSize(filter, null));
    }

    private List<ProductRepresentation> computeResultList(Range range, String filter, Long categoryId) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<ProductRepresentation> cq = cb.createQuery(ProductRepresentation.class);
        Root<Product> c = cq.from(Product.class);
        cq.select(
                cb.construct(
                        ProductRepresentation.class,
                        c.get("id"),
                        c.get("designation"),
                        c.get("summary"),
                        c.get("details"),
                        c.get("picture"),
                        c.get("price")
                )
        );

        applyCriteria(cb, c, cq, filter, categoryId);

        return fillCriteria(entityManager.createQuery(cq), filter, categoryId)
                .setFirstResult((int) range.getOffset())
                .setMaxResults((int) range.getSize())
                .getResultList();
    }

    private long computeFullRequestSize(String filter, Long categoryId) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Long> cq = cb.createQuery(Long.class);
        Root<Product> r = cq.from(Product.class);
        cq.select(cb.count(r));

        applyCriteria(cb, r, cq, filter, categoryId);

        return fillCriteria(entityManager.createQuery(cq), filter, categoryId).getSingleResult();
    }

    private void applyCriteria(CriteriaBuilder cb, Root<?> r, CriteriaQuery<?> cq, String filter, Long categoryId) {
        if (categoryId != null) {
            cq.where(cb.equal(r.get("categoryId"), cb.parameter(Long.class, "categoryId")));
        }
        if (filter != null) {
            cq.where(cb.or(
                    cb.like(r.get("designation"), cb.parameter(String.class, "filter")),
                    cb.like(r.get("summary"), cb.parameter(String.class, "filter")),
                    cb.like(r.get("details"), cb.parameter(String.class, "filter"))
            ));
        }
    }

    private <T> TypedQuery<T> fillCriteria(TypedQuery<T> q, String filter, Long categoryId) {
        if (categoryId != null) {
            q.setParameter("categoryId", categoryId);
        }
        if (filter != null) {
            q.setParameter("filter", "%" + filter + "%");
        }
        return q;
    }
}
```