---
title: "Business framework manual"
type: "home"
zones:
    - "Business"
sections:
    - "BusinessManual"
tags:
    - domain-driven design
menu:
    BusinessManual:
        weight: 10
noToc: true
---

This is the reference manual for all topics of the Business framework. 

{{% callout tips %}}
It is best to have a good understanding of the [essential notions](..) before going further into this reference manual.
{{% /callout %}}

# Entities

An entity is used to represent a domain concept distinguished by an identity. This identity must remain the same through the whole entity lifecycle.

* [Characteristics]({{< ref "docs/business/manual/entities.md#characteristics" >}})
* [Declaration]({{< ref "docs/business/manual/entities.md#declaration" >}})
* [Example]({{< ref "docs/business/manual/entities.md#example" >}})

# Value Objects

A value object is used to describe or compute some characteristic of a domain concept. It does not have an identity.

* [Characteristics]({{< ref "docs/business/manual/value-objects.md#characteristics" >}})
* [Declaration]({{< ref "docs/business/manual/value-objects.md#declaration" >}})
* [Usage as identifiers]({{< ref "docs/business/manual/value-objects.md#usage-as-identifiers" >}})
* [Example]({{< ref "docs/business/manual/value-objects.md#example" >}})

# Aggregates

An aggregate is a cluster of cohesive entities and value objects that is treated as a single unit. Aggregates have clear boundaries and are loosely coupled to each other.

* [Characteristics]({{< ref "docs/business/manual/aggregates.md#characteristics" >}})
* [Declaration]({{< ref "docs/business/manual/aggregates.md#declaration" >}})
* [Defining aggregate boundaries]({{< ref "docs/business/manual/aggregates.md#defining-aggregate-boundaries" >}})
* [Example]({{< ref "docs/business/manual/aggregates.md#example" >}})

# Specifications

A specification encapsulates a business criteria and is able to tell if a candidate object matches this criteria.

* [Characteristics]({{< ref "docs/business/manual/specifications.md#characteristics" >}})
* [Declaration]({{< ref "docs/business/manual/specifications.md#declaration" >}})
* [Usage]({{< ref "docs/business/manual/specifications.md#usage" >}})
* [Built-in specifications]({{< ref "docs/business/manual/specifications.md#built-in-specifications" >}})
* [Specification builder]({{< ref "docs/business/manual/specifications.md#specification-builder" >}})

# Factories

A factory is responsible for creating a whole, internally consistent aggregate when it is too complicated to do
it in a constructor.

* [Characteristics]({{< ref "docs/business/manual/factories.md#characteristics" >}})
* [Explicit factory]({{< ref "docs/business/manual/factories.md#explicit-factory" >}})
* [Default factory]({{< ref "docs/business/manual/factories.md#default-factory" >}})
* [Identity generation]({{< ref "docs/business/manual/factories.md#identity-generation" >}})
* [Example]({{< ref "docs/business/manual/factories.md#example" >}})

# Repositories

A repository is responsible for consistently storing and retrieving a whole aggregate. It has a simple collection-like global interface and optionally domain-specific methods.

* [Characteristics]({{< ref "docs/business/manual/repositories.md#characteristics" >}})
* [Explicit repository]({{< ref "docs/business/manual/repositories.md#explicit-repository" >}})
* [Generated repository]({{< ref "docs/business/manual/repositories.md#generated-repository" >}})
* [Default repository]({{< ref "docs/business/manual/repositories.md#default-repository" >}})
* [Example]({{< ref "docs/business/manual/repositories.md#example" >}})

# Services

A service is a stateless object that implements domain, applicative or infrastructure logic.

* [Characteristics]({{< ref "docs/business/manual/services.md#characteristics" >}})
* [Declaration]({{< ref "docs/business/manual/services.md#declaration" >}})
* [Usage]({{< ref "docs/business/manual/services.md#usage" >}})
* [Example]({{< ref "docs/business/manual/services.md#example" >}})

# Policies

A policy is used to encapsulate a varying business rule or process in a separate object. Multiple versions of the policy object represent different ways the process can be done.

* [Characteristics]({{< ref "docs/business/manual/policies.md#characteristics" >}})
* [Declaration]({{< ref "docs/business/manual/policies.md#declaration" >}})
* [Usage]({{< ref "docs/business/manual/policies.md#usage" >}})
* [Example]({{< ref "docs/business/manual/policies.md#example" >}})

# Domain events

A domain event is used to represent something that happened in the domain. It happened in the past and is of interest to the business.

* [Characteristics]({{< ref "docs/business/manual/events.md#characteristics" >}})
* [Declaration]({{< ref "docs/business/manual/events.md#declaration" >}})

# Assemblers

An assembler is an interface object responsible for mapping one or more aggregate(s) to a Data Transfer Object (DTO) 
and back.

* [Explicit assembler]({{< ref "docs/business/manual/assemblers.md#explicit-assembler" >}})
* [Default assembler]({{< ref "docs/business/manual/assemblers.md#default-assembler" >}})
* [Fluent assembler DSL]({{< ref "docs/business/manual/assemblers.md#fluent-assembler-dsl" >}})
* [Example]({{< ref "docs/business/manual/assemblers.md#example" >}})

# Pagination

The paginator is a helper supporting different modes of pagination: offset-based, page-based and key-based. 

* [Pagination modes]({{< ref "docs/business/manual/pagination.md#pagination-modes" >}})
* [Usage]({{< ref "docs/business/manual/pagination.md#usage" >}})
* [Example]({{< ref "docs/business/manual/pagination.md#example" >}})
