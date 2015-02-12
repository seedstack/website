---
title: "Infrastructure layer"
zones:
    - "Business"
sections:
    - "BusinessConcepts"
menu:
    BusinessConcepts:
        weight: 60
---

# Introduction

In addition to the three vertical layers (domain/application/interface), there is also the infrastructure. It supports 
all of the other layers by providing communication between the layers, implementing the persistence for business
 objects, supporting libraries for the interfaces layer, etc.

In brief, the infrastructure consists of **everything that exists independently of our application**: external libraries, 
database engine, application server, messaging backend and so on.

# Packaging

In every layer, a good practice is to create packages that clearly identify:

- they are part of infrastructure, i.e. `infrastructure`
- the kind of infrastructure, e.g. `persistence`
- the implementation/technology, eg. jpa `org.mycompany.*.infrastructure.persistence.jpa`
- and/or the "object of concern", eg. an entity `org.mycompany.*.infrastructure.persistence.product`