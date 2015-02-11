+++
title       = "CQRS basics"
zones     = [ "business" ]
sections  = [ "concept" ]
+++

CQRS (Command Query Responsibilities Segregation) is a design on top of DDD used for scaling architecture. Its aim is to 
separate command and query; write and read. You either write or read, not both.

# READ model

The READ model is **specialized/optimize for reads**, ie. queries. This concept is expressed in the SEED Business 
Framework by the finders. A finder is in charge of retrieving data from the persistence. It cannot retrieve Domain 
objects so data takes the form of representations.

