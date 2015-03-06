---
title: "Interface layer"
type: "home"
zones:
    - "Business"
sections:
    - "BusinessConcepts"
menu:
    BusinessConcepts:
        weight: 50
---


In the same way the domain layer has to organise objects to represent the business, the interface has to provide representations for its clients. 

- These representations can essentially be exposed through:

	- [REST resources](#!/seed-doc/web) 
	- [Web Services](#!/seed-doc/ws) 
	- [command line](#!/seed-doc/shell)

- Those representations are built through **[Assembler](#!/business-doc/object-oriented-programming#assembler)** and **Finder** patterns.