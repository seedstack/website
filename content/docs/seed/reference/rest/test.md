---
title: "Test"
type: "reference"
zones:
    - "Seed"
sections:
    - "SeedRest"
tags:
    - "rest"
    - "jax-rs"
    - "test"
menu:
    SeedRest:
        weight: 40
---

Fully testing REST resources requires web integration test support as described
[here](#!/seed-doc/test/integration#web-integration-testing). Basic steps are:

* Test class has to extend `AbstractSeedWebIT` in order to launch an integration test with Arquillian.
* Test class has to contain a method to package the deployed WAR.
* Finally you can write your test method.

For example :

    public class ProductsResourceIT extends AbstractSeedWebIT {
        @Deployment
        public static WebArchive createDeployment() {
            return ShrinkWrap.create(WebArchive.class).setWebXML("WEB-INF/web.xml");
        }
    
        @RunAsClient
        @Test
        public void testCreate(@ArquillianResource URL baseURL) throws JSONException {
            JSONObject obj = new JSONObject();
            obj.put("summary", "The world's highest resolution notebook");
            obj.put("categoryId", 1);
            obj.put("designation", "macbook pro");
            obj.put("picture", "mypictureurl");
            obj.put("price", 200.0);
    
            //assert response code
            String response = expect().statusCode(201).given().
                    header("Accept", "application/json").header("Content-Type", "application/json").
                    body(obj.toString()).post(baseURL.toString() + "rest/products/").asString();
    
            // assert body
            JSONAssert.assertEquals(obj, new JSONObject(response), false);
        }
    }


This example uses two libraries for easy REST testing:

* REST Assured which can test various HTTP request/response scenarios. More information [here](https://code.google.com/p/rest-assured/)).
* JSON Assert which can assert conditions on JSON documents. More information [here](https://github.com/skyscreamer/JSONassert)).
