---
title: "JPA persistence"
type: "guide"
zones:
    - "Guides"
sections:
    - "GuidesTasks"
subsections:
    - "Create a Web application"
menu:
    CreateApplicationGuide:
        weight: 40
---

# Persistence with JPA

## Repository

Now that we have defined the domain, we can create the repository implementations **in the infrastructure layer**.

### Product

- We create a new package: **org.seedstack.tutorial.infrastructure.persistence.product**
- We create a **ProductJpaRepository** class: 
```
package org.seedstack.tutorial.infrastructure.persistence.product;

import org.seedstack.seed.business.jpa.infrastructure.repository.GenericJpaRepository;
import org.seedstack.tutorial.domaine.product.Product;
import org.seedstack.tutorial.domaine.product.ProductRepository;

public class ProductJpaRepository extends GenericJpaRepository<Product, Long>
		implements ProductRepository {

}
```
> Extending `GenericJpaRepository` brings standard CRUD methods to the repository.

### Category

- We create a new package: **org.seedstack.tutorial.infrastructure.persistence.category**.
- We create **CategoryJpaRepository** class:
```
package org.seedstack.tutorial.infrastructure.persistence.category;

import org.seedstack.seed.business.jpa.infrastructure.repository.GenericJpaRepository;
import org.seedstack.tutorial.domain.category.Category;
import org.seedstack.tutorial.domain.category.CategoryRepository;

public class CategoryJpaRepository extends GenericJpaRepository<Category, Long>
		implements CategoryRepository {

}
```

## Configuration

- We need some configuration for JPA to work properly.

- Create a **persistence.xml** file inside **src/main/resources/META-INF/**:

```
<persistence xmlns="http://java.sun.com/xml/ns/persistence"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://java.sun.com/xml/ns/persistence http://java.sun.com/xml/ns/persistence/persistence_2_0.xsd"
	version="2.0">

	<persistence-unit name="seed-tutorial-domain" transaction-type="RESOURCE_LOCAL">
		<class>org.seedstack.tutorial.domain.product.Product</class>
		<class>org.seedstack.tutorial.domain.category.Category</class>
	</persistence-unit>
</persistence>
```