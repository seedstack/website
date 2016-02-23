---
title: "Cryptography"
type: "home"
zones:
    - "Seed"
sections:
    - "SeedManual"
tags:
    - "cryptography"
    - "certificate"
    - "keystore"
    - "encryption"
    - "hashing"
menu:
    SeedManual:
        weight: 35
---

Seed provides helpers for Java cryptography:

 * Private key encryption
 * Secure hashing
 * KeyStore configuration
 * SSL configuration

{{< dependency g="org.seedstack.seed" a="seed-crypto" >}}

# Encryption

Seed provides an `EncryptionService` which allows you to securely store or exchange data. It is based on a Public Key Infrastructure (PKI),
i.e. it encrypt data using a public key and then decrypt it with a private key. To use it you will have to declare the key pair to use.
In java keys are stored using a `KeyStore`.

## KeyStores

Key stores are created using the `keytool` command-line tool (see [keytool documentation](http://docs.oracle.com/javase/8/docs/technotes/tools/windows/keytool.html)).
Here is an example creating a keystore with a key pair:

```ini
keytool -genkeypair -dname "cn=Mark Jones, ou=Java, o=Oracle, c=US"
    -alias database -keypass <new password for private key>
    -keystore ./src/main/resources/app.keystore
    -storepass <new password for keystore> -validity 180
```

Then, it is possible to declare the key store in your configuration as follows. Notice that multiple key stores can be registered.
The key store configuration is prefixed by `org.seedstack.seed.crypto.keystore.<keystore name>`. The prefix ends with a
logical key store name.

```ini
org.seedstack.seed.crypto.keystores=keystoreName, keystoreName2

[org.seedstack.seed.crypto.keystore.keystoreName]
path=src/main/resources/app.keystore
password=<new password for keystore>

# Optional configuration
type=<keystore type>
provider=<keystore provider>

[org.seedstack.seed.crypto.keystore.keystoreName2]
...
```

{{% callout tips %}}
Two keytstore names are registered by default: `master` and `default`. The usage of the master keystore is described later
in this [documentation](#configuration-files-protection). The default is only a shortcut when you don't need to have multiple
keystores. So you don't have to specify:

```ini
org.seedstack.seed.crypto.keystores=default, master
```
{{% /callout %}}

## Key pairs

Java key stores protect keys using passwords and associate public/private key pairs to aliases. For instance, if you want
to register the previously key pair, do it as follows.

```ini
[org.seedstack.seed.crypto.keystore.keystoreName.alias]
database.password=21B06221FC9EC83BAAD
ssl.password=70E65711ACFEF03F59A
```

{{% callout warning %}}
It is recommended for security to store certificates in a key store. But if you can't, it is still possible to use an external certificate as follows.
{{% /callout %}}

```ini
[org.seedstack.seed.crypto.cert]
client1.resource=client.cer
client2.file=src/main/resources/seed.crt
```
In this example `client1` and `client2` correspond to keystore aliases. The first alias is loaded from a resource and
the second from a file. A current limitation with external certificates is that the aliases have to be present in one of the configured keystores.

## EncryptionService
When a key store is configured, it is then possible to inject an `EncryptionService` for a specific alias.
The alias password has to be configured for accessing the private key. Otherwise the `EncryptionService`
will still be bound, but it won't be able to decrypt data. Only the encryption will be possible.

```java
@Inject
@Named("database") // named with the key pair alias
private EncryptionService encryptionService;
```

And use it to crypt or decrypt data as follows:

```java
final String stringToCrypt = "secret in plain text";

byte[] encryptedString = encryptionService.encrypt(chaine.getBytes());
byte[] decryptedString = encryptionService.decrypt(encrypt);
```

# Secure hashing

Seed crypto also comes with an `HashService` which provides the current best default hashing algorithms.

```java
@Inject
private HashingService hashingService;
...
Hash hash = hashingService.createHash("string to hash");
```

It also provides a **secure password validation**. It takes a password, hashes it and checks
it against the previously hashed password.

```java
Hash hash = hashingService.validatePassword(passwordToCheck, verifiedHash);
```

# Configuration files protection

Sometimes, you need to have **sensitive data in your configuration files**. Using Seed cryto, it is possible to
encrypt values in your props files. This values are decrypted at runtime. For instance, you can encrypt a password
and specify it in the props file with the `${password:XXX}` syntax.

```ini
[org.seedstack.seed.crypto.keystore.keystoreName.alias]
client.password=${password:70E65711ACFEF03F59AFCED...F96563A19B18954B49DD59}
```

The password decrypting is done using an `EncryptionService`. This service expect a key store named `master` with a
key alias named `seed`.

```ini
[org.seedstack.seed.crypto.keystore.master]
path=src/main/resources/masterkeystore.jck
password=${env:KS_PASSWD}
alias.seed.password=${env:KEY_PASSWD}
```