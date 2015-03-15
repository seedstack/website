---
title: "Concepts overview"
type: "home"
zones:
    - "Business"
sections:
    - "BusinessConcepts"
menu:
    BusinessConcepts:
        weight: 10
---

This concept section is intended to introduce and explain all the concepts that you will need to know and master to build
successful business applications. A lot of these concepts come from the DDD software approach which is central to business
framework based applications, but you will also read about concepts from specific architectures like CQRS or REST.

You will NOT be presented with in-depth coverage of all the DDD subtleties, so to go beyond the basics you should have
a look at the [bibliography](../bibliography). Moreover, links will be provided in the text when related quality content 
is available.

# Domain-Driven Design

Domain-Driven Design is **more about a way of thinking than about code** but this approach has nonetheless a great
impact on the way your business will be coded. DDD does not introduce new concepts or design patterns on its own. As
a matter of fact, you will surely recognize some patterns you already know behind DDD names. It goes beyond design
patterns though, as it dictates when, where and how to use them to solve real business problems. 

{{% callout info %}}
As its name suggest, DDD is focused on the business and its model. This model exists independently of applications and
specific use cases and should be designed a such. Applications are clients of the model: software that will use this 
model to address enterprise needs. Naturally, particular use cases and UI ideas can be used as inputs for thinking about
the model as the software is produced. But the model itself should be independent of its clients.  
{{% /callout %}}

The model being independent of its use by applications, it can used to resolve various business problems inside many
differently architectured applications.




