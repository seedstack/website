---
title: "Pagination"
type: "home"
zones:
    - "Business"
sections:
    - "BusinessManual"
tags:
    - "pagination"
    - "data"
    - "page"
    - "chunk"
    - "range"
menu:
    BusinessManual:
        weight: 80
---

The data presentation API helps developers presenting the data from their domain to external actors. Those are
generally remote REST clients like a browser, web services consumers or RPC/RMI clients. The data presentation API supports
patterns often used in data restitution: pagination, infinite-scroll, random chunk access.

# Concepts
The following describes the API. We'll specialize some concepts already presented like the finder.
We focus the creation of this API on solving the problem of returning portion result out of very big one.

![domain aggregates](/puml/business/business-api-interfaces-finder.png)

- A **Range** is just a class that represents an **offset** and a **size**.
- A **Result** symbolises a canonical representation of the ranged return of a request made from a persistence. It holds:
    - the list that contains the result itself,
    - the actual list size,
    - the full size of the whole request.
- A **View** represents a viewpoint of an already existing list. Its focus is the restitution of a portion of the given
list.
- `RangeFinder<Item,Criteria>` is a High level interfaces for finder that sum up the following assertion: Given a
**Range** and a **Criteria** please find the **Result** for the Item type.

<div class="callout callout-info">
Notice that <strong>Criteria</strong> here, is not a type, but a generic to be substituted when subclassing. For
instance a <code>Map&lt;String, Object&gt;</code> or a custom class.
</div>

In order to **move out the complex computation (page, chunk, ..) away from the RangeFinder** we only provide him a
Range. Its first and only objective is to fetch data from persistence according to a given criteria. View management is
completely orthogonal to the restitution a given list from a criteria.

The actual *Range* can be greater than the needed portion. This way, the result can be reused according that the Criteria
and the result size has not changed.

# Example

Create a finder by extending the `BaseRangeFinder` class. This abstract class needs you to implement two methods.

- The `computeResultList()` method which should return the list of matching entity with the expected range.
- The `computeFullRequestSize()` method should return the size of complete list matching the criteria.

For instance create the following interface:

     @Finder
     public interface Dto1Finder extends RangeFinder<Dto1, Map<String, Object>> {

         PaginatedView<ProductRepresentation> findItemByQuery(Page page, String searchQuery);
     }

Implement it as follows:

    @JpaUnit("my-unit")
    @Transactional
    public class Dto1SimpleJpaFinder extends BaseRangeFinder<Dto1, String>
        implements Dto1Finder {

        @Inject
        private EntityManager entityManager;

        @Override
        public PaginatedView<ProductRepresentation> findItemByQuery(Page page, String query) {
            Range range = Range.rangeFromPageInfo(page.getIndex(), page.getCapacity());
            Result<Dto1> result = find(range, query);
            return new PaginatedView<Dto1>(result, page);
        }

        @Override
        protected List<Dto1> computeResultList(Range range , String criteria) {
            CriteriaQuery<AggRoot1> query = getAggRoot1CriteriaQuery(criteria);
            List<AggRoot1> resultList = entityManager.createQuery(query)
                    .setFirstResult((new BigDecimal(range.getOffset()).intValue()))
                    .setMaxResults(new BigDecimal(range.getSize()).intValue())
                    .getResultList();

            return assemblers.assembleDtoFromAggregate(resultList);
        }

        @Override
        protected long computeFullRequestSize(String criteria) {
            CriteriaQuery<Long> query = getAggRoot1CountCriteriaQuery(criteria);
            return entityManager.createQuery(query).getSingleResult();
        }

        ...
    }

Then, inject the finder with its interface and use it as follows:

```java
@Inject
Dto1Finder dto1Finder;

@GET
@Rel("search")
@Produces(MediaType.APPLICATION_JSON)
public Response list(@QueryParam("q") String searchQuery,
                     @DefaultValue("0") @QueryParam("pageIndex") Long pageIndex,
                     @DefaultValue("10") @QueryParam("pageSize") Integer pageSize) {

    // Call the finder with the requested page
    Page page = new Page(pageIndex, pageSize);
    PaginatedView<Dto1> view = dto1Finder.findItemByQuery(page, searchQuery);

    // Create an HAL representation with the page and the total number of elements
    Dto1sRepresentation representation = new Dto1sRepresentation(page,
        view.getResultSize());

    // Add the list of item to the representation
    representation.embedded("items", view.getView());

    // If a next page is available add to link to it
    if (view.hasNext()) {
        Page next = view.next();

        representation.link("next", relRegistry.uri("search")
                .set("pageIndex", next.getIndex())
                .set("pageSize", next.getCapacity()).expand());
    }

    // If a previous page is available add to link to it
    if (view.hasPrev()) {
        Page prev = view.prev();

        representation.link("prev", relRegistry.uri("search")
                .set("pageIndex", prev.getIndex())
                .set("pageSize", prev.getCapacity()).expand());
    }

    return Response.ok(representation).build();
}
```

{{% callout info %}}
The following example uses the HAL media type. For more information about it, read the documentation about
[hypermedia](/docs/seed/manual/rest/restful-api/).
{{% /callout %}}
