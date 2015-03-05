---
title: "Integration tests"
type: "reference"
zones:
    - "Seed"
sections:
    - "SeedTest"
tags:
    - "maven"
    - "test"
    - "arquillian"
menu:
    SeedTest:
        weight: 30
---

There are different integration supports depending on the application integration environment (eg. web, batch). 
Those supports provide the ability to test components at the highest level (eg. a web container) without having to mock the context or any low-level component.
It also has a dependency on **SEED unit test support** thus bringing all of its tools.

# Getting started

## Maven dependencies

For simple integration tests (no web container), use following dependency snippet:

    <dependency>
        <groupId>org.seedstack.seed</groupId>
        <artifactId>seed-integrationtest-support</artifactId>
        <scope>test</scope>
    </dependency>

For web application integration tests, use following dependency snippet instead:

    <dependency>
        <groupId>org.seedstack.seed</groupId>
        <artifactId>seed-integrationtest-web-support</artifactId>
        <scope>test</scope>
    </dependency>

## Simple integration testing

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

## Web integration testing

Web integration testing is based on `Arquillian` which enables you to programatically deploy defined artifacts and test
them either in a "white box mode" by injecting your components and testing them, or in a "black box mode" by interacting with
your web application as an external client.

To define such a test Class, simply extends the `AbstractSeedWebIT` helper class:

    public class RestIT extends AbstractSeedWebIT {
        @Inject
        Activity1 activity1;

        @Deployment
        public static WebArchive createDeployment() {
            return ShrinkWrap.create(WebArchive.class)
                       .addAsResource("META-INF/configuration/my-conf.props", 
                                      "META-INF/configuration/my-conf.props")
                       .setWebXML("WEB-INF/web.xml");
        }

        @Test
        public void my_activity_is_injectable() {
            Assertions.assertThat(activity1).isNotNull();
        }

        @RunAsClient
        @Test
        public void my_web_app_is_working(@ArquillianResource URL baseURL) {
            expect().statusCode(200).when().get(baseURL.toString());
        }

    }

Above code illustrates different "testing styles":

* A white box test style of Activity1. Here the Activity1 component is simply injected and checked.
* A black box test style of the REST resource /products.
  * The `@Deployment` annotation marks the method which builds the deployed artifact. It uses ShrinkWrap library
  which is part of Arquillian (more information on ShrinkWrap [here](https://community.jboss.org/wiki/ShrinkWrap).
  * The `@RunAsClient` annotation enables this test to be run from a Web client perspective.
  * The `@ArquillianResource` annotation injects the Arquillian-generated base URL of the test Web server. This URL is
  used in a basic HTTP test.