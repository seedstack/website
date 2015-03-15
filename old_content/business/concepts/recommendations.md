---
title: "Recommendations"
type: "home"
zones:
    - "Business"
sections:
    - "BusinessConcepts"
menu:
    BusinessConcepts:
        weight: 80
---

Most of the documentation is about guiding how to do things properly. However there might be other correct ways to use
the provided tools but there are also things that should clearly be avoided (because they are anti-patterns to DDD and
Supple Design) and here is a short list that might le extended later on:

# Do's

Either as a result of the presented patterns in this documentation or as a design principle, you should find that your code respects the following:

- Each object has one responsibility
- Mostly interfaces are visible (implementations being kept in package visibility) to other layers or packages
- Testing is easy

# Dont's

- **Do not inject services into entities or value objects**: instead use factories, services, policies to add behaviour around them
- **Do not put your domain logic in your application**: if the application layer is getting big, it should probably partially be re-factored into the domain layer.
