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

## Generate a certificate

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

## Configure the keystore

Now edit the `application.yaml` file of your project. Add the following section to configure the `master` keystore:

```yaml
crypto:
  keystores:
    master:
      path: master.jks
      password: changeMe
      aliases:
        ssl: changeMe
```

## Enable HTTPS

In the `application.yaml` file, add the following section:

```yaml
web:
  server:
    https: true
    port: 443
```

This will enable HTTPS on port 443 (which is the default HTTPS port). 

{{% callout info %}}
SeedStack will automatically use the `ssl` alias of the `master` keystore to create the necessary SSL context. See the
[SSL configuration]({{< ref "docs/core/crypto.md#ssl" >}}) to change the defaults.
{{% /callout %}}

## Try it!

Launch the Web application:

```bash
mvn seedstack:run
```

And point your browser to [https://localhost](https://localhost).

{{% callout info %}}
You will see a security warning in your browser because the certificate is self-signed for now. Ignore it at the moment,
to display the application homepage. 
{{% /callout %}}

## Create a CSR

To obtain a trusted certificate, we need to create a "Certificate Signing Request" (CSR):

```bash
keytool -certreq -alias ssl -keystore master.jks -file request.csr
``` 

This CSR will have to be submitted to the "Certificate Authority" (CA) of your choice, which will return the signed
certificate to you.

## Import the CA certificates

To be able to validate the chain of trust, you have to import the CA certificate(s) into the keystore:

```bash
keytool -import -trustcacerts -alias rootca -file root_ca.crt -keystore master.jks
``` 

{{% callout info %}}
Depending on your CA, you may also have to import one or more intermediate certificates in addition to the root certificate.
Just add them to the keystore, each under a unique alias name. 
{{% /callout %}}

## Import the signed certificate

After your CA has handed your signed certificate back, import it in the keystore under the same alias:

```bash
keytool -import -alias ssl -file signed_cert.cer -keystore master.jks 
```

## Try it!

After deploying the application on an URL matching the CN of your certificate, you can point your browser to the CN. In
our (fake) example, it is:

```plain
https://myserver.mycompany.com
```

## Bonus: mutual authentication

If you want to go beyond HTTPS and require HTTPS clients to send their own certificate, set the following configuration:

```yaml
crypto:
  ssl:
    clientAuthMode: REQUIRED
```

To use the client certificate as a subject identity you will need to have the following dependency in your project:

{{< dependency g="org.seedstack.seed" a="seed-web-security" >}}

You will also need to configure the security subsystem to use the certificate for authentication and authorization purposes:

```yaml
security:
  realm: X509CertificateRealm
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
