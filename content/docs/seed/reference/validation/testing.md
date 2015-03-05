---
title: "Testing"
type: "reference"
zones:
    - "Seed"
sections:
    - "SeedValidation"
tags:
    - "validation"
    - "maven"
    - "test"
menu:
    SeedValidation:
        weight: 40
---

In order to use validation while testing, just add the following Maven dependencies to your project:

    <dependency>
        <groupId>javax.el</groupId>
        <artifactId>javax.el-api</artifactId>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>org.seedstack.seed</groupId>
        <artifactId>seed-el-support</artifactId>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>org.seedstack.seed</groupId>
        <artifactId>seed-integrationtest-support</artifactId>
        <scope>test</scope>
    </dependency>

