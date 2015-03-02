---
title: "Automatic integration"
type: "home"
zones:
    - "Seed"
menu:
    SeedConcepts:
        weight: 40
---

The key feature of the Java framework, which enables to integrate any SeedStack-based reusable code at almost zero cost 
is called **automatic integration**. This is made possible by the combination of three design choices:

* Classpath scanning and automatic discovery of code patterns,
* The ability to build a main injector dynamically from plugins,
* The convention-over-configuration paradigm and sensible configuration defaults.

As a result, you have nothing to specify to integrate multiple components together. When a support is present 
and active in an application it automatically detects the relevant code patterns in the whole classpath and make them 
available through the injector. Any required initialization or shutdown code is already managed by the support plugin.

<div class="callout callout-info">
You can <strong>add an entire feature</strong> to an application by simply <strong>adding a dependency to the classpath</strong>.
</div>

While this is the key to the modularity of SeedStack, it also applies to your code as well. You can write business code
that leverages SeedStack building blocks, which will automatically benefits from this automatic integration capability.
Modular business code is very easily achieved in SeedStack. For more information look at the [business framework documentation](/docs/business).
