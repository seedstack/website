---
title: "Domain description"
type: "guide"
zones:
    - "Guides"
sections:
    - "CreateApplicationGuide"
menu:
    CreateApplicationGuide:
        weight: 30
---

# Simple model

For our tutorial, we'll consider the following model

![business model](/img/guides/webapp/domain-diagram.png)

And we'll focus on the Product and Category.

# Architecture

SEED comes with a Business Framework - Seed Business Support - that relies on principles described in the Domain Driven Design method (or DDD). 

{{% callout info %}}
To better understand this tutorial, refer to [business framework concepts](/docs/business/concepts).
{{% /callout %}}

# Implementation

- The web project will contain the web interface layer : REST resources and Web Services. It can also contain the static web resources (html, js...).
- The app project will contain the application layer, the domain layer and the infrastructure layer.
- The entities will bear the description of their persistence with JPA annotations.

## Domain

### Product

Let's create a package **org.seedstack.tutorial.domain.product** which will contain the domain layer concerning the product.

We can create our **Product** entity.

	package org.seedstack.tutorial.domain.product;
	
	import javax.persistence.Column;
	import javax.persistence.Entity;
	import javax.persistence.Id;
	
	import org.seedstack.seed.business.jpa.domain.BaseJpaAggregateRoot;
	
	@Entity
	public class Product extends BaseJpaAggregateRoot<Long> {
	
		@Id
		private Long entityId;
		private String designation;
		private String summary;
		@Column(columnDefinition = "text")
		private String details;
		private String picture;
		private Double price;
		private Long categoryId;
	
		Product() {
		}
	
		@Override
		public Long getEntityId() {
			return entityId;
		}
	
		public String getDesignation() {
			return designation;
		}
	
		public void setDesignation(String designation) {
			this.designation = designation;
		}
	
		public String getSummary() {
			return summary;
		}
	
		public void setSummary(String summary) {
			this.summary = summary;
		}
	
		public String getDetails() {
			return details;
		}
	
		public void setDetails(String details) {
			this.details = details;
		}
	
		public String getPicture() {
			return picture;
		}
	
		public void setPicture(String picture) {
			this.picture = picture;
		}
	
		public Double getPrice() {
			return price;
		}
	
		public void setPrice(Double price) {
			this.price = price;
		}
	
		public long getCategoryId() {
			return categoryId;
		}
	
		public void setCategoryId(long categoryId) {
			this.categoryId = categoryId;
		}
	
		public void setEntityId(Long entityId) {
			this.entityId = entityId;
		}
	}

{{% callout info %}}
Note the constructor in visibility package to prevent creation of a Product outside the package. The Factory will be in the same package.
{{% /callout %}}

We create the **ProductFactory** interface.

	package org.seedstack.tutorial.domain.product;
	
	import org.seedstack.seed.business.api.domain.GenericFactory;
	
	public interface ProductFactory extends GenericFactory<Product> {
	
		Product createProduct(Long id, String designation, String summary, String details, String picture, Double price, Long categoryId);
	
	}

And its **ProductFactoryDefault** implementation.

	package org.seedstack.tutorial.domain.product;
	
	import org.seedstack.seed.business.core.domain.base.BaseFactory;
	
	public class ProductFactoryDefault extends BaseFactory<Product> implements ProductFactory {
	
		@Override
		public Product createProduct(Long id, String designation, String summary, String details, String picture, Double price, Long categoryId) {
	
			Product product = new Product();
			product.setEntityId(id);
			product.setDesignation(designation);
			product.setSummary(summary);
			product.setDetails(details);
			product.setPicture(picture);
			product.setPrice(price);
			product.setCategoryId(categoryId);
			return product;
		}
	}

We also create the **ProductRepository** interface.

	package org.seedstack.tutorial.domain.product;
	
	import org.seedstack.seed.business.api.domain.GenericRepository;
	
	public interface ProductRepository extends GenericRepository<Product, Long> {
	
	}

### Category

We now create a package **org.seedstack.tutorial.domain.category**. We create **Category** class:

	package org.seedstack.tutorial.domain.category;
	
	import javax.persistence.Entity;
	import javax.persistence.GeneratedValue;
	import javax.persistence.GenerationType;
	import javax.persistence.Id;
	
	import org.seedstack.seed.business.jpa.domain.BaseJpaAggregateRoot;
	
	@Entity
	public class Category extends BaseJpaAggregateRoot<Long> {
	
		@Id
		@GeneratedValue(strategy = GenerationType.AUTO)
		private Long categoryId;
		private String name;
		private String urlImg;
	
		Category() {
		}
	
		Category(String name, String urlImg) {
			this.name = name;
			this.urlImg = urlImg;
		}
	
		public Category(Long categoryId, String name, String urlImg) {
			super();
			this.categoryId = categoryId;
			this.name = name;
			this.urlImg = urlImg;
		}
	
		public String getName() {
			return name;
		}
	
		public void setName(String name) {
			this.name = name;
		}
	
		public String getUrlImg() {
			return urlImg;
		}
	
		public void setUrlImg(String urlImg) {
			this.urlImg = urlImg;
		}
	
		@Override
		public Long getEntityId() {
			return categoryId;
		}
	
		public void setEntityId(Long entityId) {
			this.categoryId = entityId;
		}
	}

**CategoryFactory** interface:

	package org.seedstack.tutorial.domain.category;
	
	import org.seedstack.seed.business.api.domain.GenericFactory;
	
	public interface CategoryFactory extends GenericFactory<Category> {
	
		Category createCategory(Long id, String name, String urlImg);
	
	}

**CategoryFactoryDefault** implementation:


	package org.seedstack.tutorial.domain.category;
	
	import org.seedstack.seed.business.core.domain.base.BaseFactory;
	
	public class CategoryFactoryDefault extends BaseFactory<Category> implements CategoryFactory {
	
		@Override
		public Category createCategory(Long id, String name, String urlImg) {
			Category category = new Category();
			category.setEntityId(id);
			category.setName(name);
			category.setUrlImg(urlImg);
			return category;
		}
	}
	
**CategoryRepository** interface:

	package org.seedstack.tutorial.domain.category;
	
	import org.seedstack.seed.business.api.domain.GenericRepository;
	
	public interface CategoryRepository extends GenericRepository<Category, Long> {
	}
