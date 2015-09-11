---
title: "Overview"
type: "addon"
zones:
    - "Addons"
tags:
    - "batch"
    - "maven"
    - "spring"
sections:
    - "AddonsFunctions"
subsections:
    - "Batch monitoring"
menu:
    AddonsFunctionsBatchMonitoring:
        weight: 10
---

The SeedStack batch monitoring function provides a Web user interface to monitor the execution of Spring Batch jobs. You
can use it to inspect jobs, executions and steps. Execution statistics are provided.

To add the function to your application, add the following dependency to your Web module pom:

    <dependency>
    	<groupId>org.seedstack.functions.batch-monitoring</groupId>
    	<artifactId>seed-batch-monitoring-web</artifactId>
    </dependency>

