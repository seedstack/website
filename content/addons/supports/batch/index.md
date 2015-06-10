---
title: "Spring batch overview"
type: "addon"
zones:
    - "Addons"
tags:
    - "batch"
    - "maven"
    - "spring"
sections:
    - "AddonsSupports"
subsections:
    - "Spring batch"
menu:
    AddonsSupportsSpringBatch:
        weight: 10
---

This support provides Spring-Batch integration. Spring-Batch is a comprehensive solution to implement full-featured
batch jobs in Java. More information about Spring Batch on [http://docs.spring.io/spring-batch/](http://docs.spring.io/spring-batch/).

To enable SEED batch support use the following dependency snippet in your batch module:

    <dependency>
        <groupId>org.seedstack.seed</groupId>
        <artifactId>seed-springbatch-support</artifactId>
    </dependency>

All Spring context XML files **must be** in under the `META-INF/spring` classpath location.


