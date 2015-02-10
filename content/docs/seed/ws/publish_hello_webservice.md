The goal of this page is to detail the creation of an Hello World soap based Web Service.

# WSDL

```
<?xml version="1.0" encoding="UTF-8"?>
<wsdl:definitions
        xmlns="http://schemas.xmlsoap.org/wsdl/"
        xmlns:xsd="http://www.w3.org/2001/XMLSchema"
        xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/"
        xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/"
        targetNamespace="http://xml.inetpsa.com/wsdl/seed/hello/"
        xmlns:tns="http://xml.inetpsa.com/wsdl/seed/hello/"
        name="HelloService">

    <wsdl:types></wsdl:types>

    <wsdl:message name="sayHello">
        <wsdl:part name="firstName" type="xsd:string"/>
    </wsdl:message>
    <wsdl:message name="sayHelloResponse">
        <wsdl:part name="return" type="xsd:string"/>
    </wsdl:message>

    <wsdl:portType name="Hello">
        <wsdl:operation name="sayHello">
            <wsdl:input message="tns:sayHello"/>
            <wsdl:output message="tns:sayHelloResponse"/>
        </wsdl:operation>
    </wsdl:portType>

    <wsdl:binding name="HelloServicePortBinding" type="tns:Hello">
        <soap:binding style="rpc"   transport="http://schemas.xmlsoap.org/soap/http"/>
        <wsdl:operation name="sayHello">
            <soap:operation soapAction=""/>
            <wsdl:input>
                <soap:body
                        namespace="http://xml.inetpsa.com/wsdl/seed/hello/"
                        use="literal"/>
            </wsdl:input>
            <wsdl:output>
                <soap:body
                        namespace="http://xml.inetpsa.com/wsdl/seed/hello/"
                        use="literal"/>
            </wsdl:output>
        </wsdl:operation>
    </wsdl:binding>
    <wsdl:service name="HelloService">

        <wsdl:port name="HelloServicePort" binding="tns:HelloServicePortBinding">
            <wsdl:documentation>Hello World</wsdl:documentation>
            <soap:address location="http://localhost:8080/ws/hello"></soap:address>
        </wsdl:port>
    </wsdl:service>
</wsdl:definitions>
```

# Java code

Configure the `jaxws-maven-plugin` and use the `wsimport` goal to generate web service java interface.

Then create a class which implement the generated interface by ws-import.

```
@WebService(
    endpointInterface = "com.inetpsa.xml.wsdl.seed.hello.HelloService",
    targetNamespace = "http://xml.inetpsa.com/wsdl/seed/hello/",
    serviceName = "HelloService",
    portName = "HelloServicePort"
)
public class HelloServiceTest implements HelloService {
    public String sayHello(String param) {
        return "Hello " + param;
    }
}
```

# Configuration

To configure your endpoint, just add the following properties to your configuration:

    [com.inetpsa.seed.ws]
    endpoints = HelloService
    endpoint.HelloService.implementation = fully.qualified.package.name.HelloServiceTest
    endpoint.HelloService.wsdl = Hello.wsdl
    endpoint.HelloService.url = /ws/hello

Note that the WSDL location is relative to `META-INF/ws`.