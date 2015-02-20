---
title: "Overview"
zones:
    - "Seed"
sections:
    - "SeedMail"
menu:
    SeedMail:
        weight: 10
---

Mail support provides integrates JAVA mail in SEED. To add the mail support in your project, use
the following dependency snippet:

    <dependency>
        <groupId>org.seedstack.seed</groupId>
        <artifactId>seed-mail-support</artifactId>
    </dependency>

You can use any configured JAVA mail session in your application code by injecting it:
 
    @Inject
    @Named("myProvider1")
    Session myProvider1Session;
    
