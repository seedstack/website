SEED brings a JUnit Runner that creates a SEED environment for tests execution. A test class is managed by SEED and allows a developer to inject classes via the `@Inject` annotation or use `@Transactional`, `@Logging` or `@Configuration` annotations.

# Database connection

- For tests purpose, we'll use an HSQL database. 
- We create **src/test/resources/META-INF/configuration/com.inetpsa.seed-tut.props** file with following properties :

```
com.inetpsa.seed.transaction.manager = com.inetpsa.seed.transaction.internal.LocalTransactionManager
com.inetpsa.seed.transaction.default-handler = com.inetpsa.seed.persistence.jpa.internal.JpaTransactionHandler

com.inetpsa.seed.persistence.jpa.units=seed-tutorial-domain

[com.inetpsa.seed.persistence.jpa.unit.seed-tutorial-domain.property]
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

	package com.inetpsa.tut.infrastructure.persistence.category;
	
	import javax.inject.Inject;
	
	import org.assertj.core.api.Assertions;
	import org.junit.After;
	import org.junit.Before;
	import org.junit.Test;
	import org.junit.runner.RunWith;
	import org.slf4j.Logger;
	
	import com.inetpsa.seed.core.api.Logging;
	import com.inetpsa.seed.it.helper.SeedITRunner;
	import com.inetpsa.seed.transaction.api.Transactional;
	import com.inetpsa.tut.domain.category.Category;
	import com.inetpsa.tut.domain.category.CategoryFactory;
	import com.inetpsa.tut.domain.category.CategoryRepository;
	
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

