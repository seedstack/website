#Persistence with JPA

##Repository

Now that we have defined the domain, we can create the repository implementations **in the infrastructure layer**.

###Product

- We create a new package: **com.inetpsa.tut.infrastructure.persistence.product**
- We create a **ProductJpaRepository** class: 
```
package com.inetpsa.tut.infrastructure.persistence.product;

import com.inetpsa.seed.business.jpa.infrastructure.repository.GenericJpaRepository;
import com.inetpsa.tut.domaine.product.Product;
import com.inetpsa.tut.domaine.product.ProductRepository;

public class ProductJpaRepository extends GenericJpaRepository<Product, Long>
		implements ProductRepository {

}
```
> Extending `GenericJpaRepository` brings standard CRUD methods to the repository.

###Category

- We create a new package: **com.inetpsa.tut.infrastructure.persistence.category**.
- We create **CategoryJpaRepository** class:
```
package com.inetpsa.tut.infrastructure.persistence.category;

import com.inetpsa.seed.business.jpa.infrastructure.repository.GenericJpaRepository;
import com.inetpsa.tut.domain.category.Category;
import com.inetpsa.tut.domain.category.CategoryRepository;

public class CategoryJpaRepository extends GenericJpaRepository<Category, Long>
		implements CategoryRepository {

}
```

##Configuration

- We need some configuration for JPA to work properly.

- Create a **persistence.xml** file inside **src/main/resources/META-INF/**:

```
<persistence xmlns="http://java.sun.com/xml/ns/persistence"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://java.sun.com/xml/ns/persistence http://java.sun.com/xml/ns/persistence/persistence_2_0.xsd"
	version="2.0">

	<persistence-unit name="seed-tutorial-domain" transaction-type="RESOURCE_LOCAL">
		<class>com.inetpsa.tut.domain.product.Product</class>
		<class>com.inetpsa.tut.domain.category.Category</class>
	</persistence-unit>
</persistence>
```