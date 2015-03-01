---
title: "Business framework overview"
type: "home"
zones:
    - "Business"
menu:
    BusinessIntroduction:
        weight: 10
---

# Conception

SEED Business Framework brings a simple and standard way to code projects with medium to complex business logic. 
It provides tools and guides to enable its founding concepts to naturally sink into your projects and help to to get 
a supple and scalable design. Those concepts are based on a few design styles : 
[Object Oriented Design](#!/business-doc/object-oriented-paradigm), 
[Domain Driven Design](#!/business-doc/understanding-ddd) 
and some [C.Q.R.S](#!/business-doc/understanding-cqrs). 
Those subjects are documented on their own.

# Code

Seed Business Framework provides a set of building blocks to facilitate the creation and the maintenance of large 
development projects. By using the same coding conventions, developers can share a common way of organizing concepts and 
code.

SEED Business Framework building blocks are based on [Domain Driven Design](#) concepts and layers taking advantage of 
the robustness and completeness of this approach.

Use of SEED Business Framework is optimal when the [Business Domain](#) is medium to complex although it will also fit 
for easy projects thanks to the many helper interfaces and classes. Most non complex project will become complex as the 
business and requirements evolve.

# Important

Seed Business Framework will guide you in the design of your applications but it's neither a "magic thingy" nor a 
"silver bullet". You'll have to understand each building block, but it won't generate any code. Indeed SEED Business 
Framework provides default implementations (earlier referred to as "helpers") of concepts but understanding their 
originating concepts is the key for a good design/use and the possibility to create your own implementations.