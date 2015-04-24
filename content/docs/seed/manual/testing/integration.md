---
title: "Integration testing"
type: "manual"
zones:
    - "Seed"
sections:
    - "SeedTest"
tags:
    - "maven"
    - "test"
    - "junit"
    - "example"
menu:
    SeedTest:
        weight: 30
---

There are different integration supports depending on the application integration environment (eg. web, batch). 
Those supports provide the ability to test components at the highest level (eg. a web container) without having to mock 
the context or any low-level component.

# Maven dependencies

For simple integration tests (no web container), use following dependency snippet:

    <dependency>
        <groupId>org.seedstack.seed</groupId>
        <artifactId>seed-integrationtest-support</artifactId>
        <scope>test</scope>
    </dependency>

# Simple integration testing

`SeedITRunner` extends `BlockJUnit4ClassRunner` and provides a full SEED environment to test your components in a white box.
To define such a test Class, simply extends the `AbstractSeedIT` helper class:

    public class CategoryJpaRepositoryIT extends AbstractSeedIT {

        @Inject
        private CategoryRepository categoryRepository;

        @Inject
        private CategoryFactory categoryFactory;

        private Category createCategory() {
            Category category = categoryFactory.createCategory("Camera", "./url/to/image.jpg");
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
