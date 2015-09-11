---
title: "Core overview"
type: "manual"
zones:
    - "Business"
sections:
    - "BusinessCore"
menu:
    BusinessCore:
        weight: 10
---

A majority of DDD concepts are implemented as building blocks by the business framework to help you code faster. But you
don't always want to go for the fastest implementation and may need to abstract your code from the framework a bit further.

# Three abstraction levels 

The business framework allows you to choose the abstraction level you want for your code. There are three abstraction
level that can you can choose from, on a class-by-class basis:

* **Annotation level**. You can make the framework recognize your classes simply by annotating them. No need to implement any
interface, nor extend base classes. While this mode is great for decoupling your code from the framework you may find that
some of the helpers cannot work these classes as they won't have the required signatures. You will have full dependency
injection though, provided that you define interfaces for your classes yourself. *Framework coupling is at the minimum 
but development speed is reduced. Also note that this mode is preferably reserved to people fluent with DDD principles.* 
* **Interface level**. Implementing framework interfaces will make the framework recognize your classes and will allow
it to work with them as they will have the required signatures. In this mode you benefit from full dependency injection
and almost full framework functionality. Some predefined behaviors may be missing for some objects like out-of-the-box
equality for entities and value objects. *It is a good balance between framework coupling and development speed and is
suitable to people that know the DDD principles well.* 
* **Base class level**. Extending framework base classes will provide you full framework functionality, including base
behavior. *Framework coupling is higher but a higher development speed is gained. It allows people starting with DDD to
benefit from implementation correctness in various areas.* 

{{% callout info %}}
Note that although you can mix the three levels in the same project, it is recommended to define which approach suits
your team best and stick with it.
{{% /callout %}}

# Code pattern detection

To recognize your classes, the business framework scans them and recognize code patterns depending on the abstraction
level you use (see above). It works in two steps:

* First it scans interfaces that are annotated with a recognized concept,
* Then is collects classes implementing those interfaces. If multiple implementations are found for an interface, it
can detects qualifiers to differentiate them. See [qualified injection](qualified-injection) for more information.  

Once a code pattern is properly recognized, it can be injected through its interface in any managed instance. 

