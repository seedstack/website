---
title: "Java framework manual"
type: "home"
zones:
    - "Seed"
sections:
    - "SeedManual"
tags:
    - "startup"
    - "shutdown"
    - "lifecycle"
menu:
    SeedManual:
        weight: 0
---

This is the reference manual for all topics of the Java framework. 

{{% callout tips %}}
It is best to have a good understanding of the [essential notions](..) before going further into this reference manual.
{{% /callout %}}

# Application lifecycle

* [Startup](running#startup)
* [Shutdown](running#shutdown)
* [Lifecycle listener](running#lifecycle-listener)

# Command-line

Applications or services accepting command-line arguments and options:

* [Defining commands](cli#defining-commands)
* [Injecting arguments and options](cli#arguments-and-options)
* [Running commands](cli#running-commands)

# Web applications

Applications or services served with an HTTP server (embedded or not): 

* [Working with servlets, filters and listeners](web#servlets-filters-and-listeners)
* [Working with WebSockets](web#websockets)
* [Serving static resources](web#static-resources)
* [Cross-Origin Resource Sharing (CORS)](web#cors)

# REST

Exposing REST APIs from Web applications:  

* [Configuration](rest#configuration)
* [Usage](rest#usage)
* [Hypermedia](rest#hypermedia)

# Security

Securing execution of application code:

* [Subjects](security#subjects), [roles](security#roles) and [permissions](security#permissions)
* [Realms](security#realms)
* [Code access-control](security#code-access-control)
* [HTTP access-control](security#http-access-control)
* [Testing](security#testing)

# Cryptography

* [Key stores](crypto#key-stores)
* [Certificates](crypto#certificates)
* [Encryption and decryption](crypto#encryption-and-decryption)
* [Secure hashing](crypto#secure-hashing)
* [Encrypting configuration values](crypto#encrypting-configuration-values)
* [SSL](crypto#ssl)

# Transactions

* [Local, global or no transaction ?](transactions#local-global-or-no-transaction)
* [The transaction manager](transactions#the-transaction-manager)
* [Usage](transactions#usage)

# Testing

* [Unit tests](testing#unit-tests)
* [Integration tests](testing#integration-tests)
* [Web integration tests](testing#web-integration-tests)
