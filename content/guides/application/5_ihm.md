Now that our **domain** and associated **infrastructure** are in place and tested, it's time to focus on the **interface layer**. Let's create a REST resource to serve data requested by web UIs.

#Configuration

##App project

We need to configure our "app" project for JPA to work properly. To keep it simple, we'll create a HSQL database. We create a **src/test/resources/META-INF/configuration/com.inetpsa.seed-tut.props** with following properties:

	[com.inetpsa.seed]
	transaction.manager = com.inetpsa.seed.transaction.internal.LocalTransactionManager
	transaction.default-handler = com.inetpsa.seed.persistence.jpa.internal.JpaTransactionHandler
	core.application-id = seed-tutorial
	persistence.jpa.units = seed-tutorial-domain
	
	[com.inetpsa.seed.persistence.jpa.unit.seed-tutorial-domain.property]
	javax.persistence.jdbc.driver = org.hsqldb.jdbcDriver
	javax.persistence.jdbc.url = jdbc:hsqldb:mem:testdb
	javax.persistence.jdbc.user = sa
	javax.persistence.jdbc.password =
	hibernate.dialect = org.hibernate.dialect.HSQLDialect
	hibernate.hbm2ddl.auto = create
	sql.enforce_strict_size = true
	
> Note: HSQL database is just an example. Any type of connection or datasource declared a JNDI resource can be used.

##Web project

The **web.xml** file was created by the archetype and requires no more configuration.

#Interface layer

We'll create following classes in the "web" project:

##Representations

The resources expose representations of the domain objects. Let's create them first.

- ProductRepresentation:
```
package com.inetpsa.tut.rest.product;

import com.inetpsa.seed.business.api.interfaces.assembler.MatchingEntityId;
import com.inetpsa.seed.business.api.interfaces.assembler.MatchingFactoryParameter;

public class ProductRepresentation {
	private Long id;

	private String designation;
	private String summary;
	private String details;
	private String picture;
	private Double price;
	private Long categoryId;
	private String categoryName;

	public ProductRepresentation() {
	}

	public ProductRepresentation(Long id, String designation, String summary,
			String details, String picture, Double price, Long categoryId) {
		super();
		this.id = id;
		this.designation = designation;
		this.summary = summary;
		this.details = details;
		this.picture = picture;
		this.price = price;
		this.categoryId = categoryId;
	}

	public ProductRepresentation(Long id, String designation, String summary,
			String details, String picture, Double price, Long categoryId,
			String categoryName) {
		super();
		this.id = id;
		this.designation = designation;
		this.summary = summary;
		this.details = details;
		this.picture = picture;
		this.price = price;
		this.categoryId = categoryId;
		this.categoryName = categoryName;
	}

	@MatchingFactoryParameter(order = 0)
	@MatchingEntityId
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	@MatchingFactoryParameter(order = 1)
	public String getDesignation() {
		return designation;
	}

	public void setDesignation(String designation) {
		this.designation = designation;
	}

	@MatchingFactoryParameter(order = 2)
	public String getSummary() {
		return summary;
	}

	public void setSummary(String summary) {
		this.summary = summary;
	}

	@MatchingFactoryParameter(order = 3)
	public String getDetails() {
		return details;
	}

	public void setDetails(String details) {
		this.details = details;
	}

	@MatchingFactoryParameter(order = 4)
	public String getPicture() {
		return picture;
	}

	public void setPicture(String picture) {
		this.picture = picture;
	}

	@MatchingFactoryParameter(order = 5)
	public Double getPrice() {
		return price;
	}

	public void setPrice(Double price) {
		this.price = price;
	}

	@MatchingFactoryParameter(order = 6)
	public Long getCategoryId() {
		return categoryId;
	}

	public void setCategoryId(Long categoryId) {
		this.categoryId = categoryId;
	}

	public String getCategoryName() {
		return categoryName;
	}

	public void setCategoryName(String categoryName) {
		this.categoryName = categoryName;
	}
}
```

- CategoryRepresentation:
```
package com.inetpsa.tut.rest.category;

import com.inetpsa.seed.business.api.interfaces.assembler.MatchingEntityId;
import com.inetpsa.seed.business.api.interfaces.assembler.MatchingFactoryParameter;

public class CategoryRepresentation {

	private Long id;
	private String name;
	private String urlImg;

	public CategoryRepresentation() {
	}

	public CategoryRepresentation(Long id, String name, String urlImg) {
		this.id = id;
		this.name = name;
		this.urlImg = urlImg;
	}

	@MatchingFactoryParameter(order = 0)
	@MatchingEntityId
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	@MatchingFactoryParameter(order = 1)
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@MatchingFactoryParameter(order = 2)
	public String getUrlImg() {
		return urlImg;
	}

	public void setUrlImg(String urlImg) {
		this.urlImg = urlImg;
	}

}
```

> `@MatchingFactoryParameter` and `@MatchingEntityId` annotations provide the necessary information for assemblers to identify which arguments are to be called with the associated factory.

##Assembler

An assembler pattern is used to transfer the state of the *Entities* to *DAO/Representation* objects. An assembler has two methods : 

- `doAssembleDtoFromEntity(dto, entity)` to create a dto from an entity 
- `doMergeEntityWithDto(entity, dto)` to merge the mutable fields of an **existing** entity with the data from the dto.

Let's create assemblers to map entity and representations:

- ProductAssembler
```
package com.inetpsa.tut.rest.product;

import com.inetpsa.seed.business.api.interfaces.assembler.BaseAssembler;
import com.inetpsa.tut.domain.product.Product;

public class ProductAssembler extends
		BaseAssembler<Product, ProductRepresentation> {

	@Override
	protected void doAssembleDtoFromEntity(ProductRepresentation targetDto,
			Product sourceEntity) {
		targetDto.setId(sourceEntity.getEntityId());
		targetDto.setDesignation(sourceEntity.getDesignation());
		targetDto.setDetails(sourceEntity.getDetails());
		targetDto.setPicture(sourceEntity.getPicture());
		targetDto.setPrice(sourceEntity.getPrice());
		targetDto.setSummary(sourceEntity.getSummary());
		targetDto.setCategoryId(sourceEntity.getCategoryId());
	}

	@Override
	protected void doMergeEntityWithDto(Product targetEntity,
			ProductRepresentation sourceDto) {
		targetEntity.setEntityId(sourceDto.getId());
		targetEntity.setDesignation(sourceDto.getDesignation());
		targetEntity.setDetails(sourceDto.getDetails());
		targetEntity.setPicture(sourceDto.getPicture());
		targetEntity.setPrice(sourceDto.getPrice());
		targetEntity.setCategoryId(sourceDto.getCategoryId());
		targetEntity.setSummary(sourceDto.getSummary());
	}

}
```

-CategoryAssembler

```
package com.inetpsa.tut.rest.category;

import com.inetpsa.seed.business.api.interfaces.assembler.BaseAssembler;
import com.inetpsa.tut.domain.category.Category;

public class CategoryAssembler extends
		BaseAssembler<Category, CategoryRepresentation> {

	@Override
	protected void doAssembleDtoFromEntity(CategoryRepresentation targetDto,
			Category sourceEntity) {
		targetDto.setId(sourceEntity.getEntityId());
		targetDto.setName(sourceEntity.getName());
		targetDto.setUrlImg(sourceEntity.getUrlImg());

	}

	@Override
	protected void doMergeEntityWithDto(Category targetEntity,
			CategoryRepresentation sourceDto) {
		targetEntity.setEntityId(sourceDto.getId());
		targetEntity.setName(sourceDto.getName());
		targetEntity.setUrlImg(sourceDto.getUrlImg());
	}
}
```

##Finder

We can delegate searching and data transfer (DTO/Entity and vice versa) operations to a `Finder`. Its role is to query the database to retrieve all the requested data without "polluting" the `Repository`. Since a `Finder` will usually depend on JPA, we declare its interface and implement it in the **infrastructure** layer.

- ProductFinder (interface)

```
package com.inetpsa.tut.rest.product;

import java.util.List;

import com.inetpsa.seed.business.api.interfaces.query.finder.Finder;
import com.inetpsa.seed.transaction.api.Transactional;

@Finder
@Transactional
public interface ProductFinder {

	List<ProductRepresentation> findAllProducts();

	ProductRepresentation findProductById(long value);

	List<ProductRepresentation> findProductsByCategory(long id);

}
```

- ProductFinder JPA implementation (notice the infrastructure package name)

``` 
package com.inetpsa.tut.infrastructure.finders;

import java.util.List;

import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;

import com.inetpsa.seed.business.helpers.Assemblers;
import com.inetpsa.tut.domain.product.Product;
import com.inetpsa.tut.rest.product.ProductFinder;
import com.inetpsa.tut.rest.product.ProductRepresentation;

public class JpaProductFinder implements ProductFinder {

	@Inject
	private EntityManager entityManager;
	@Inject
	private Assemblers productAssembler;

	@Override
	public List<ProductRepresentation> findAllProducts() {
		TypedQuery<ProductRepresentation> query = entityManager
				.createQuery(
						"select new "
								+ ProductRepresentation.class.getName()
								+ "(p.entityId, p.designation, p.summary, p.details, p.picture, p.price,p.categoryId,cat.name)"
								+ " from Product p,Category cat where p.categoryId=cat.categoryId ",
						ProductRepresentation.class);

		return query.getResultList();
	}

	@Override
	public ProductRepresentation findProductById(long value) {
		Product product = entityManager.find(Product.class, value);
		return (product == null ? null : productAssembler
				.assembleDtoFromEntity(ProductRepresentation.class, product));
	}

	@Override
	public List<ProductRepresentation> findProductsByCategory(long id) {
		TypedQuery<ProductRepresentation> query = entityManager
				.createQuery(
						"select new "
								+ ProductRepresentation.class.getName()
								+ "(p.entityId, p.designation, p.summary, p.details, p.picture, p.price)"
								+ " from Product p where p.categoryId =:id",
						ProductRepresentation.class);
		query.setParameter("id", id);
		return query.getResultList();
	}
}
```

- CategoryFinder (interface)
```
package com.inetpsa.tut.rest.category;

import java.util.List;

import com.inetpsa.seed.business.api.interfaces.query.finder.Finder;
import com.inetpsa.seed.transaction.api.Transactional;

@Finder
@Transactional
public interface CategoryFinder {

	CategoryRepresentation findCategoryById(long id);

	List<CategoryRepresentation> findAllCategory();

}
```
- CategoryFinder  JPA implementation (notice the infrastructure package name)
```
package com.inetpsa.tut.infrastructure.finders;

import java.util.List;
import java.util.Map;

import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.Query;
import javax.persistence.TypedQuery;

import com.inetpsa.seed.business.api.interfaces.query.range.Range;
import com.inetpsa.seed.business.helpers.Assemblers;
import com.inetpsa.seed.business.jpa.interfaces.query.finder.AbstractSimpleJpaFinder;
import com.inetpsa.tut.domain.category.Category;
import com.inetpsa.tut.rest.category.CategoryFinder;
import com.inetpsa.tut.rest.category.CategoryRepresentation;

public class JpaCategoryfinder extends
		AbstractSimpleJpaFinder<CategoryRepresentation> implements
		CategoryFinder {

	@Inject
	private EntityManager entityManager;
	@Inject
	private Assemblers categoryAssembler;

	@Override
	public CategoryRepresentation findCategoryById(long value) {

		Category category = entityManager.find(Category.class, value);
		return (category == null ? null : categoryAssembler
				.assembleDtoFromEntity(CategoryRepresentation.class, category));
	}

	@Override
	public List<CategoryRepresentation> findAllCategory() {
		TypedQuery<CategoryRepresentation> query = entityManager.createQuery(
				"select new " + CategoryRepresentation.class.getName()
						+ " (c.categoryId, c.name,c.urlImg) from Category c",
				CategoryRepresentation.class);
		return query.getResultList();
	}

	@Override
	protected List<CategoryRepresentation> computeResultList(Range range,
			Map<String, Object> criteria) {

		TypedQuery<CategoryRepresentation> query = entityManager.createQuery(
				"select new " + CategoryRepresentation.class.getName()
						+ " (c.categoryId, c.name,c.urlImg) from "
						+ "Category c", CategoryRepresentation.class);

		query.setFirstResult(range.getOffset());
		query.setMaxResults(range.getSize());
		return query.getResultList();
	}

	@Override
	protected long computeFullRequestSize(Map<String, Object> criteria) {
		Query query = entityManager.createQuery("select count(*) from "
				+ "Category ");
		return (Long) query.getSingleResult();
	}

}
```

##Resource

We can now create our resources.

- ProductsResource
```
package com.inetpsa.tut.rest.product;

import java.net.URI;
import java.net.URISyntaxException;

import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.core.UriInfo;

import org.slf4j.Logger;

import com.inetpsa.seed.business.helpers.Assemblers;
import com.inetpsa.seed.core.api.Logging;
import com.inetpsa.seed.transaction.api.Transactional;
import com.inetpsa.tut.domain.product.Product;
import com.inetpsa.tut.domain.product.ProductRepository;

@Path("/products")
@Transactional
public class ProductsResource {
	@Inject
	private ProductFinder productFinder;
	@Inject
	ProductRepository productRepository;
	@Inject
	private Assemblers assemblers;
	@Logging
	private static Logger logger;

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Response getProducts() {

		return Response.ok(productFinder.findAllProducts()).build();
	}

	@GET
	@Path("/{productId: [0-9]+}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getProduct(@PathParam("productId") long productId) {
		ProductRepresentation productFinderProductById = productFinder
				.findProductById(productId);
		productFinder.findAllProducts();
		if (productFinderProductById == null)
			return Response.status(Status.NOT_FOUND).build();

		return Response.ok(productFinderProductById).build();
	}

	@PUT
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("/{productId: [0-9]+}")
	public Response updateproduct(ProductRepresentation productRepresentation,
			@PathParam("productId") long productId) {
		if (productRepresentation.getId() != productId)
			throw new IllegalArgumentException(
					"Cannot change product identifier");

		Product product = assemblers.retrieveThenMergeEntityWithDto(
				productRepresentation, Product.class);
		product = productRepository.save(product);

		if (product == null) {
			logger.info("customer with id {} not updated",
					productRepresentation.getId());
			return Response.status(Status.NOT_MODIFIED).build();
		}
		ProductRepresentation productRepresentation1 = assemblers
				.assembleDtoFromEntity(ProductRepresentation.class, product);
		return Response.ok(productRepresentation1).build();
	}

	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Response createProduct(ProductRepresentation productRepresentation,
			@Context UriInfo uriInfo) throws URISyntaxException {

		Product product = assemblers.createThenMergeEntityWithDto(
				productRepresentation, Product.class);
		productRepository.persist(product);

		if (product == null) {
			logger.info("customer with id {} not updated",
					productRepresentation.getId());
			return Response.status(Status.NOT_ACCEPTABLE).build();
		}

		ProductRepresentation productRepresentation1 = assemblers
				.assembleDtoFromEntity(ProductRepresentation.class, product);
		URI newUri = new URI(uriInfo.getRequestUri().toString() + "/"
				+ productRepresentation1.getId());
		return Response.created(newUri).entity(productRepresentation1).build();
	}

	@DELETE
	@Path("/{productId: [0-9]+}")
	public Response deleteProduct(@PathParam("productId") long productId) {
		productRepository.delete(productId);
		return Response.status(Status.OK).build();
	}

}
```

- CategoryResource

```
package com.inetpsa.tut.rest.category;

import java.util.List;

import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.inetpsa.seed.transaction.api.Transactional;
import com.inetpsa.tut.domain.category.Category;
import com.inetpsa.tut.domain.category.CategoryFactory;
import com.inetpsa.tut.domain.category.CategoryRepository;
import com.inetpsa.tut.rest.product.ProductFinder;
import com.inetpsa.tut.rest.product.ProductRepresentation;

@Path("/categories")
@Transactional
public class CategoryResource {

	@Inject
	private CategoryFinder categoryFinder;

	@Inject
	private CategoryRepository categoryRepository;

	@Inject
	private ProductFinder productFinder;

	@Inject
	private CategoryFactory categoryFactory;

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Response list() {

		List<CategoryRepresentation> findAllCategory = categoryFinder
				.findAllCategory();

		if (findAllCategory.size() == 0) {
			Category category = categoryFactory.createCategory(null, "Camera",
					"./fragments/seed-store/images/canon.jpg");
			categoryRepository.persist(category);
			return Response.ok(categoryFinder.findAllCategory()).build();
		}
		return Response.ok(findAllCategory).build();

	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/{categoryId}/products")
	public Response listProductByCategory(
			@PathParam("categoryId") long categoryId) {
		List<ProductRepresentation> productRepresentations = productFinder
				.findProductsByCategory(categoryId);
		return Response.ok().entity(productRepresentations).build();
	}

}
```

> Note the use of the *Assemblers* class each time we manipulate entity/dto.

#Is it working ?

Now deploy your web project on a Web Server (eg. Tomcat 7) and launch the application.