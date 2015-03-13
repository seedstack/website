---
title: "Application service"
type: "reference"
zones:
    - "Business"
sections:
    - "BusinessService"
menu:
    BusinessService:
        weight: 20
---

Application services are **services which are specific to your application**. A domain may be shared between multiple 
applications, for example in the case where you have a batch and a web application. Some service may be shared too, 
in this case they will be domain services. But if it make no sense for them to be shared they will be application service.

# Create an application service

An application service should define a interface annotated with `@ApplicationService` and a implementation of that interface. 

## Interface

    package org.mycompany.myapp.application.services;

    @ApplicationService
    public interface OrderManagementService {
    
        OrderOptions getOrderReviewOptions(Order order, Customer customer);
    
    }
    
## Implementation
    
    package org.mycompany.myapp.application.services.impl;
    
    public class OrderManagementServiceImpl implements OrderManagementService {
    
        OrderOptions getOrderReviewOptions(Order order, Customer customer){
            ...
            return orderOptions;
        }
    
    }
    
# Multiple implementations

It is possible to define multiple implementations of the same service by adding a qualifier on it. See 
[here](#!/business-doc/hands-on-application/qualifier) for detailed information.
