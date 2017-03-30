---
title: "Cryptography"
type: "home"
zones:
    - "Seed"
sections:
    - "SeedManual"
menu:
    SeedManual:
        weight: 70
---

SeedStack support easy configuration of Java key stores and SSL along with services for private key encryption 
and secure hashing.<!--more--> 

# Key stores

A key store is a storage facility for cryptographic keys and certificates. Key stores are created using the `keytool` 
command-line tool (see [keytool documentation](http://docs.oracle.com/javase/8/docs/technotes/tools/windows/keytool.html)).

Here is an example creating a key store named `some.keystore` with a key pair named `alias1`:

```bash
keytool -genkeypair -dname "cn=Mark Jones, ou=Java, o=Oracle, c=US" -keystore some.keystore -storepass <keystore password> -validity 180 -alias alias1 -keypass <alias password>
```

You can configure key stores in your application as below:

{{% config p="crypto.keystores" %}}
```yaml
crypto:
  # Configured key stores
  keystores:
    # Logical name of the key store
    keystore1:
      # Path of the key store
      path: (String)
      
      # Password of the key store
      password: (String)
      
      # [Optional] Type of the key store (use the default key store type if not specified)
      type: (String)
      
      # [Optional] The security provider to use (will default to the registered list if not provided)
      provider: (String)
      
      # Configured aliases in the key store
      aliases:
        # Name of the alias in the key store
        alias1:
          # Password of the alias
          password: (String)
         
          # String qualifier to use for injecting the cryptography services (defaults to the name of the alias if not specified)
          qualifier: (String)

  # Configured external certificates 
  certificates:
    # Logical name of the certificate
    certificate1:
      # File location of the certificate (exclusive with resource)
      file: (String)
      
      # Classpath location of the certificate (exclusive with file)
      resource: (String)
```
{{% /config %}}  

# Certificates

It is recommended to store your key/pairs inside key stores but you can use an standalone certificates if you need too.
You can configure them as below:

{{% config p="crypto.certificates" %}}
```yaml
crypto:
  # Configured external certificates 
  certificates:
    # Logical name of the certificate
    certificate1:
      # File location of the certificate (exclusive with resource)
      file: (String)
      
      # Classpath location of the certificate (exclusive with file)
      resource: (String)
```
{{% /config %}}  

# Encryption and decryption

You can use a key/pair from a key store or a certificate to encrypt and decrypt data. Just inject an 
{{< java "org.seedstack.seed.crypto.EncryptionService" >}} qualified with the alias or certificate name:

```java
public class SomeClass {
    @Inject
    @Named("alias1")
    private EncryptionService encryptionService1;
    
    @Inject
    @Named("certificate1")
    private EncryptionService encryptionService2;
}
```

* The service `encryptionService1` will encrypt and decrypt data using the key/pair named `alias1` stored in `keystore1`. 
* The service `encryptionService2` will encrypt and decrypt data using the key/pair from the certificate `certificate1`.

{{% callout info %}}
By default, the name of the alias is used as the injection qualifier. When multiple key stores contain the same alias 
name, you can specify a different qualifier in the `qualifier` configuration option of the concerned alias(es).  
{{% /callout %}}  

You can encrypt and decrypt data with as below:

```java
public class SomeClass {
    @Inject
    @Named("alias1")
    private EncryptionService encryptionService;
    
    public byte[] encrypt(byte[] data) {
        return encryptionService.encrypt(data);
    }
    
    public byte[] decrypt(byte[] data) {
        return encryptionService.decrypt(data);
    }
}
```

# Secure hashing

You can do secure hashing using the `PBKDF2WithHmacSHA1` algorithm by injecting the {{< java "org.seedstack.seed.crypto.HashingService" >}}
interface:

```java
public class SomeClass {
    @Inject
    private HashingService hashingService;
    
    public void hash(char[] password) {
        // Hashes the password returning an object containing the salt value and the hash value  
        Hash hash = hashingService.createHash(password);
    }
    
    public void validate(char[] password, Hash knownHash) {
        // Validate the password against an already known hash
        boolean valid = hashingService.validatePassword(password, knownHash);
    }
}
```

# Encrypting configuration values

## The decrypt function

Sometimes you are required to put sensitive data, like passwords, in configuration files. You can choose to encrypt
such sensitive data and let SeedStack decrypt it only at runtime when needed. This is done with the `$decrypt(alias, value)` 
configuration function:

```yaml
crypto:
  keystores:
    master:
      path: master.keystore
      password: ${env.MASTER_KS_PASSWORD}
      aliases:
        alias1:
          password: ${env.MASTER_KS_ALIAS1_PASSWORD}
myConfig:
  password: $decrypt('alias1', '5BC99359A5...A49580F0DE3')
```

The `myConfig.password` value is encrypted in the files and only decrypted on-the-fly when accessed by the application:
* The key store named `master` is always used for decrypting values.
* The alias used to decrypt values is specified as the first argument of the `$decrypt` function.

{{% callout warning %}}
The master key store and its aliases passwords must be left unencrypted. To avoid a security hole, you need to externalize 
those passwords and provide them only at runtime, in a secured manner. All others sensitive values can be encrypted.
{{% /callout %}}
   
## The crypt tool

To crypt configuration values, you can use the `crypt` tool provided by SeedStack. You can call it with the 
[crypt goal](/docs/overview/maven-plugin/crypt) of the SeedStack Maven plugin:
  
```bash
mvn -Dargs="--alias alias1 thePasswOrd" -q org.seedstack:seedstack-maven-plugin:crypt
```
  
This will crypt the value `thePasswOrd` with the key in the `alias1` alias of the configure `master` key store.  

{{% callout info %}}
You must have a `master` key store already configured in your application.
{{% /callout %}}

# SSL

The SSL configuration required for HTTPS operation of embedded Web servers such as the 
[built-in Undertow](/docs/seed/manual/web/#with-undertow) can be found below: 

{{% config p="crypto.ssl" %}}
```yaml
  # SSL configuration (used by embedded Web servers like Undertow)    
  ssl:
    # The protocol to use for SSL communication
    protocol: (String)
    
    # The name of the key store used to load the SSL key managers ('master' by default)
    keyStore: (String)
     
    # The name of the key store used as a trust store for SSL ('master' by default)
    trustStore: (String)
    
    # The name of the alias in the key store ('ssl' by default)
    alias: (String)

    # The set of ciphers that can be used for SSL communication
    ciphers: [ (String) ]
    
    # The client authentication mode
    clientAuthMode: (NOT_REQUESTED|REQUESTED|REQUIRED)
```
{{% /config %}}  
