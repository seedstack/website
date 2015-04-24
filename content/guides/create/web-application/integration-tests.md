---
title: "Integration tests"
type: "guide"
zones:
    - "Guides"
sections:
    - "CreateApplicationGuide"
menu:
    CreateApplicationGuide:
        weight: 50
---

SEED brings a JUnit Runner that creates a SEED environment for tests execution. A test class is managed by SEED and allows a developer to inject classes via the `@Inject` annotation or use `@Transactional`, `@Logging` or `@Configuration` annotations.

# Database connection

- For tests purpose, we'll use an HSQL database. 
- We create **src/test/resources/META-INF/configuration/org.seedstack.seed-tut.props** file with following properties :

```
org.seedstack.seed.transaction.manager = org.seedstack.seed.transaction.internal.LocalTransactionManager
org.seedstack.seed.transaction.default-handler = org.seedstack.seed.persistence.jpa.internal.JpaTransactionHandler

org.seedstack.seed.persistence.jpa.units=seed-tutorial-domain

[org.seedstack.seed.persistence.jpa.unit.seed-tutorial-domain.property]
javax.persistence.jdbc.driver=org.hsqldb.jdbcDriver
javax.persistence.jdbc.url=jdbc:hsqldb:mem:testdb
javax.persistence.jdbc.user=sa
javax.persistence.jdbc.password=
hibernate.dialect=org.hibernate.dialect.HSQLDialect
hibernate.hbm2ddl.auto=create
sql.enforce_strict_size=true
```

# Test

We write a simple test class to see if the JPA configuration is functional for `Category` entity:

	package org.seedstack.tutorial.infrastructure.persistence.category;
	
	import javax.inject.Inject;
	
	import org.assertj.core.api.Assertions;
	import org.junit.After;
	import org.junit.Before;
	import org.junit.Test;
	import org.junit.runner.RunWith;
	import org.slf4j.Logger;
	
	import org.seedstack.seed.core.api.Logging;
	import org.seedstack.seed.it.helper.SeedITRunner;
	import org.seedstack.seed.transaction.api.Transactional;
	import org.seedstack.tutorial.domain.category.Category;
	import org.seedstack.tutorial.domain.category.CategoryFactory;
	import org.seedstack.tutorial.domain.category.CategoryRepository;
	
	@RunWith(SeedITRunner.class)
	public class CategoryJpaRepositoryIT {
	    
		@Inject
		private CategoryRepository categoryRepository;
		@Inject
		private CategoryFactory categoryFactory;
	
		@Logging
		private static Logger logger;
		
		private Category createCategory() {
			Category category = categoryFactory.createCategory(null, "Camera",
					"./fragments/seed-store/images/canon.jpg");
			Assertions.assertThat(category.getEntityId()).isNull();
			categoryRepository.persist(category);
			Assertions.assertThat(category.getEntityId()).isNotNull();
			return category;
		}
	
		@Test
		@Transactional
		public void deleteCategoryTest() {
			Category category = createCategory();
			categoryRepository.delete(category.getEntityId());
			category = categoryRepository.load(category.getEntityId());
			Assertions.assertThat(category).isNull();
		}
	
	}

