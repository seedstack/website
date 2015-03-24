---
title: "Inner workings"
type: "home"
zones:
    - "Business"
sections:
    - "BusinessConcepts"
menu:
    BusinessConcepts:
        weight: 60
---

We have previously introduced the concepts used in the business
framework but what does it exactly ? You will see in the
[reference](/docs/business/reference/) that it provides interfaces,
abstrat classes and annotations. Each of them provide meaning to your
class. For instance by implementing `GenericFactory` or by annotating
a class with `@ApplicationService` you specify the concept used by the
class. Remember here to respect the
[supple design](/docs/business/concepts/tuples/): a class should have
only one concern or concept.

Of course, Business framework doesn't just provide meaning. It also
brought injection. This is done in two step. First, the framework scan
all the interfaces marked with Business framework annotations or
interfaces. Then, it scan all the implementations of these interfaces
and bind them to the interface. In the case where there are multiple
implementation for the same interface the framework use
qualifiers. See
[qualified injection](/docs/business/concepts/qualified-injection/)
for more information on that. And read this
[article](/docs/seed/concepts/dependency-injection/) if you want to
know more on dependency injection.


