---
title: "Overview"
zones:
    - "Seed"
sections:
    - "SeedBatch"
menu:
    SeedBatch:
        weight: 10
---

# Spring Batch

SEED batch support provides spring batch 2 integration. Spring batch offers traceability, jobs recovery, resources management,
scheduling, partial execution of jobs, scalability... More information about spring batch 2 on [http://docs.spring.io/spring-batch/](http://docs.spring.io/spring-batch/)

# Configuration

To enable SEED batch support use the following dependency snippet in your batch module:

    <dependency>
        <groupId>com.inetpsa.fnd.seed</groupId>
        <artifactId>seed-batch-support-springbatch2</artifactId>
    </dependency>

All Spring context xml files **MUST BE** in resource folder under `META-INF/spring/*`.


