---
title: "HTTPS with Undertow"
author: "Adrien LAUER"
date: 2018-12-18
tags:
    - Web
zones:
    - Guides
noMenu: true
---

This guide will help you generate a certificate and configure Undertow to use it for HTTPS.<!--more-->

## The project

To go through this guide, you need a Web project based on the Undertow embedded Web server. If you don't have one, invoke 
the SeedStack generator to create a `web` project type:

```bash
mvn -U org.seedstack:seedstack-maven-plugin:generate
```

## A self-signed certificate

In this section, you are going to start the process by generating a self-signed certificate.

### Generate the certificate

We are going to use the Java `keytool` program (locate in the JDK `bin` folder) to generate a keystore containing a 
2048 bits self-signed certificate and its key pair. Go into the project directory and type:

```bash
keytool -genkey -alias ssl -keyalg RSA -keysize 2048 -dname "CN=myserver.mycompany.com,OU=IT,O=My company,L=Paris,C=FR,email=contact@email.com" -keystore master.jks -storepass changeMe -keypass changeMe
```

{{% callout danger %}}
For good security, use strong and unique passwords for the key store itself and for the key.
{{% /callout %}}

{{% callout warning %}}
Update the the `dname` parameter value according to your company and/or personal details. 
{{% /callout %}}

### Configure the keystore and SSL

Now edit the `application.yaml` file of your project. Add the following section to configure the `master` keystore:

```yaml
crypto:
  keystores:
    master:
      path: master.jks
      password: changeMe
  ssl:
    keyPassword: changeMe
```

This declares:

* A keystore named `master`, based on the file we generated before.
* The password used by SSL to read the key from the keystore.

{{% callout info %}}
In SeedStack, the `master` keystore is used by default for various tasks like [configuration encryption]({{< ref "docs/core/crypto.md#encrypting-configuration-values" >}}) or SSL. 
{{% /callout %}}

### Enable HTTPS

In the `application.yaml` file, add the following section:

```yaml
web:
  server:
    https: true
```

This will enable HTTP on port 8080, HTTPS on port 8443 and will automatically redirect any HTTP access to HTTPS.

### Try it!

Launch the Web application:

```bash
mvn seedstack:run
```

And point your browser to [https://localhost:8443](https://localhost:8443).

{{% callout info %}}
You will see a security warning in your browser because the certificate is self-signed for now. Ignore it at the moment,
to display the application homepage. 
{{% /callout %}}

## A trusted certificate

In this section, you are going to ask a trusted "Certificate Authority" (CA) to sign your initial certificate to replace your self-signed one.

### Create a CSR

To obtain a trusted certificate, you need to create a "Certificate Signing Request" (CSR):

```bash
keytool -certreq -alias ssl -keystore master.jks -file request.csr
``` 

This CSR will have to be submitted to the CA of your choice, which will return the signed certificate to you.

### Import the CA certificates in the keystore

To be able to import the signed certificate in the keystore, you must first import the CA certificate(s) in the keystore:

```bash
keytool -import -trustcacerts -alias root_ca -file root_ca.crt -keystore master.jks -storepass changeMe -keypass changeMe
``` 

{{% callout info %}}
Depending on how your certificate authority work, you may also have to import one or more intermediate certificates in addition to the root certificate. Just add them to the keystore, each under a unique alias name. 

**The unbroken chain from the signed server certificate to the CA root certificate must be present and valid in the keystore.**
{{% /callout %}}

### Import the signed certificate

At last, import the signed certificate in the keystore under the same alias as your self-signed certificate to overwrite it: 

```bash
keytool -import -alias ssl -file signed_cert.cer -keystore master.jks -storepass changeMe -keypass changeMe
```

### Try it!

After deploying the application on an URL matching the CN of your certificate, you can point your browser to the CN. In
our (fake) example, it is:

```plain
https://myserver.mycompany.com
```

## Mutual authentication

This section deals about establishing a mutual authentication between the server and the clients. It's useful when you need to guarantee your client identity from their certificate.

### Create a truststore to validate client certificates

To be able to validate the chain of trust, you have to import the certification authority (CA) certificate(s) into a truststore:

```bash
keytool -import -trustcacerts -alias root_ca -file root_ca.crt -keystore truststore.jks -storepass changeMe -keypass changeMe
``` 

{{% callout info %}}
Depending on how your certificate authority work, you may also have to import one or more intermediate certificates in addition to the root certificate. Just add them to the truststore, each under a unique alias name. 

**A client certificate will be validated against the chain of CA certificates present in the truststore.**
{{% /callout %}}

{{% callout tips %}}
Some certificates, particularly the CA root, will be the same between the keystore and the truststore. You can choose to merge both stores but it is recommended to keep them separate.
{{% /callout %}}

### Configure the truststore

Now edit the `application.yaml` file of your project. Add the following section to configure the truststore:

```yaml
crypto:
  truststore:
    path: truststore.jks
    password: changeMe
```

### Configure SSL to require a client certificate

If you want to go beyond HTTPS and require HTTPS clients to send their own certificate, set the following configuration:

```yaml
crypto:
  ssl:
    clientAuthMode: REQUIRED
```

### Optional: use the client certificate for authentication

If you want to use the client certificate as the subject identity you will need to have the following dependency in your project:

{{< dependency g="org.seedstack.seed" a="seed-web-security" >}}

Then configure the security subsystem to use the certificate for authentication and authorization purposes:

```yaml
security:
  realms: X509CertificateRealm
```

To extract the certificate from the HTTP request, add the `cert` filter on the necessary URL patterns:

```yaml
security:
  web:
    urls:
      -
        pattern: "/**"
        filters: cert
```

You can inject the {{< java "org.seedstack.seed.security.SecuritySupport" >}} interface to do additional checks
on the subject:

```java
package org.generated.project.interfaces.rest;

import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import org.seedstack.seed.security.SecuritySupport;

@Path("hello")
public class HelloResource {
    @Inject
    private SecuritySupport securitySupport;

    @GET
    public String hello() {
        String id = securitySupport.getIdentityPrincipal().getPrincipal().toString();
        return "Hello " + id + "!";
    }
}
```

## Troubleshooting

Setting up a working SSL handshake can be tricky, so if you encounter any problem you can switch the Java SSL debugging on with the `-Djavax.net.debug=all` system property. Example with the `run` goal:

```bash
mvn -Djavax.net.debug=all seedstack:run
```
