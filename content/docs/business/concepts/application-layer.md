---
title: "Application layer"
zones:
    - "Business"
sections:
    - "BusinessConcepts"
menu:
    BusinessConcepts:
        weight: 40
---

# Introduction

The application layer handles application wide technical concerns such as security, logging, transactions, aggregates 
or consistency.

The application coordinates the domain layer, necessary infrastructure and libraries (Maven dependencies and 
configuration: [persistence](#!/seed-doc/persistence), SEED [supports](#!/seed-doc) and [functions](#!/functions), 
[logging](##!/seed-doc/core/logging) ...) to get the actual work done.

It should be rather thin in domain behaviour since this behaviour should come from the domain layer. It can 
host [infrastructure](#!/business-doc/understanding-ddd/infrastructure-layer#packaging) packages and/or implementations 
of interfaces contained in the domain layer.

# Application Services

- A service is **stateless**
- An application service usually involves infrastructure and/or libraries "to do the job"

For example: notification services require infrastructure and libraries (according to the implementation: email, text message) 
and would naturally fit into the application layer.