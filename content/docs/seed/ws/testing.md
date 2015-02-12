Web Services can be tested in SEED managed integration tests. You can find more about these kind of tests 
[here](#!/seed-doc/test/integration). You'll find a Web black box example below:

```
public class HelloWSIT extends AbstractSeedWebIT {
    @Deployment
    public static WebArchive createDeployment() {
        return ShrinkWrap.create(WebArchive.class).setWebXML("WEB-INF/web.xml");
    }

    @Test
    @RunAsClient
    public void webservice_is_working_correctly(@ArquillianResource URL baseURL) throws Exception {
        HelloService helloServiceClient = new HelloService();
        Hello helloServicePort = helloServiceClient.getHelloServicePort();
        ((BindingProvider)helloServicePort).getRequestContext().put(BindingProvider.ENDPOINT_ADDRESS_PROPERTY, baseURL + "ws/hello");
        
        String response = helloServicePort.sayHello("World");
        Assertions.assertThat(response).isEqualTo("Hello World");
    }
}
```

You have to specify the endpoint using `@ArquillianResource URL baseURL`, because Arquillian generates
a different base URL for each run.

You may also create standalone integration tests (outside a Web environment and as such, without Arquillian).

If you need to do manual testing, you can access the WSDL via HTTP at `http://{server}:{port}/ws/hello?wsdl`. Then you 
can use a specialized tool like SOAP UI:

![soapUI](/img/seed/soapUI.png)

