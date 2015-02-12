---
title: "Data presentation"
zones:
    - "Business"
sections:
    - "BusinessInterfaceLayer"
menu:
    BusinessInterfaceLayer:
        weight: 60
---

The data presentation API will help developers presenting the data from their domain to external actors. Those are
generally remote REST clients like a browser, web services consumers or RPC/RMI clients. The data presentation API will 
support patterns often used in **data restitution: pagination, Infinite Scroll, random chunk access**.

# Concepts
The following describes the API. We'll specialize some concepts already presented like the finder.
We focus the creation of this API on solving the problem of returning portion result out of very big one.

![domain aggregates]({business-doc}/images/uml/interfaces-finder.svg)

- A **Range** is just a class that represents an **offset** and a **size**.
- A **Result** symbolises a canonical representation of the ranged return of a request made from a persistence. It holds:
    - the list that contains the result itself,
    - the actual list size,
    - the full size of the whole request.
- A **View** represents a viewpoint of an already existing list. Its focus is the restitution of a portion of the given
list.
- `GenericFinder<Item,Criteria>` is a High level interfaces for finder that sum up the following assertion: Given a
**Range** and a **Criteria** please find the **Result** for the Item type. 

<div class="callout callout-info">
Notice that <strong>Criteria</strong> here, is not a type, but a generic to be substituted when subclassing. For
instance a <code>Map&lt;String, Object&gt;</code> or a custom class.
</div>

In order to **move out the complex computation (page, chunk, ..) away from the GenericFinder** we only provide him a 
Range. Its first and only objective is to fetch data from persistence according to a given criteria. View management is 
completely orthogonal to the restitution a given list from a criteria.

The actual *Range* can be greater than the needed portion. This way, the result can be reused according that the Criteria 
and the result size has not changed. 

# Pagination

Create a finder by extending the `BaseSimpleJpaFinder` class. This abstract class needs you to implement two methods.

- The `computeResultList()` method which should return the list of matching entity with the expected range.
- The `computeFullRequestSize()` method should return the size of complete list matching the criteria.

For instance create the following interface:

     @Finder
     public interface Dto1Finder extends GenericFinder<Dto1, Map<String, Object>> {
         ...
     }

Implement it as follows:

     public class Dto1SimpleJpaFinder extends BaseSimpleJpaFinder<Dto1, Map<String, Object>> implements Dto1Finder {

        @Inject
        EntityManager entityManager;

        @Override
        protected List<Dto1> computeResultList(Range range , Map<String,Object> criteria) {
            CriteriaQuery<AggRoot1> query = getAggRoot1CriteriaQuery(criteria);
            List<AggRoot1> resultList = entityManager.createQuery(query)
                    .setFirstResult(new BigDecimal(range.getOffset()).intValueExact())
                    .setMaxResults(range.getSize()).getResultList();

            return assemblers.assembleDtoFromAggregate(resultList);
        }

        @Override
        protected long computeFullRequestSize(Map<String,Object> criteria) {
            CriteriaQuery<Long> query = getAggRoot1CountCriteriaQuery(criteria);
            return entityManager.createQuery(query).getSingleResult();
        }

        ...
    }

Then, inject the finder with its interface.

    @Inject
    Dto1Finder dto1Finder;

Notice that if you don't need other methods than the paginated `find()` in your interface (eg. `Dto1Finder`)
you can avoid to create a custom interface and inject the finder with the `GenericFinder` interface as follows.

    @Inject
    GenericFinder<Dto1, Map<String, Object>> dto1Finder;

Finally, use it as follows:

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response list(@QueryParam("searchString") String searchString,
                         @DefaultValue("0") @QueryParam("pageIndex") Long pageIndex,
                         @DefaultValue("10") @QueryParam("pageSize") Integer pageSize) {

        // We choose a range larger than the actual page capacity.
        int rangeSize = pageSize * 4;

        // We create the range for the finder
        Range range = new Range(0, rangeSize);

        // We setup the criteria
        Map<String, Object> criteria = Maps.newHashMap();
        criteria.put("param1", searchString);

        // We launch the query
        Result<Dto1> result = dto1Finder.find(range, criteria);

        // We prepare the view for the expected page
        PaginatedView<CategoryRepresentation> paginatedView;
        paginatedView = new PaginatedView<CategoryRepresentation>(result, pageSize, pageIndex);

        return Response.ok(paginatedView).build();
    }

# Generic workflow

All of this happen in the "Interfaces layer". It can be a REST Resource, a Controller (MVC), a Web Service 
implementation, ...

## Step 1 : Get the result

![Main concepts]({business-doc}/images/interfaces-api-step1.png)

1. The application have to compute the range in which he wants the request take place. The Range can be greater than 
the actual view range (page, chunk,...)
2. The application compute the input Criteria needed by the finder. Criteria can be of any type depending on Finder 
implementations.
3. The GenericFinder will then return an object *Result<Item>* 

## Step 2 : Create the view

![Main concepts]({business-doc}/images/interfaces-api-step2.png)

When you've got the result, just create the view and get right portion from it.

