---
title: "Web integration testing"
type: "manual"
zones:
    - "Seed"
sections:
    - "SeedTest"
tags:
    - "maven"
    - "test"
    - "arquillian"
    - "junit"
    - "example"
menu:
    SeedTest:
        weight: 40
---

There are different integration supports depending on the application integration environment (eg. web, batch). 
Those supports provide the ability to test components at the highest level (eg. a web container) without having to mock 
the context or any low-level component.

# Maven dependencies

For Web integration tests, use following dependency snippet instead:

    <dependency>
        <groupId>org.seedstack.seed</groupId>
        <artifactId>seed-integrationtest-web-support</artifactId>
        <scope>test</scope>
    </dependency>

# Simple Web integration testing

Web integration testing is based on [Arquillian](http://arquillian.org/) which enables you to programatically deploy 
defined artifacts and test them either in a "white box mode" by injecting your components and testing them, or in a 
"black box mode" by interacting with your web application as an external client.

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

{{% callout info %}}
Above code illustrates the two ways of testing with Arquillian:

* A white box test style of Activity1. Here the Activity1 component is simply injected and checked.
* A black box test style of the REST resource /products.
  * The `@Deployment` annotation marks the method which builds the deployed artifact. It uses ShrinkWrap library
  which is part of Arquillian (more information on ShrinkWrap [here](https://community.jboss.org/wiki/ShrinkWrap).
  * The `@RunAsClient` annotation enables this test to be run from a Web client perspective.
  * The `@ArquillianResource` annotation injects the Arquillian-generated base URL of the test Web server. This URL is
  used in a basic HTTP test. 
{{% /callout %}}
