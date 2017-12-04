### Multiple aggregates assembler

In business code, you sometimes have to group multiple business objects together. You can do so by writing a custom class
but you can also use a tuple, which is a data structure corresponding to a sequence of immutable objects.
 
The business framework tuple integration is based on the [javatuples.org](http://javatuples.org) library. It provides tuple
classes from one to ten elements:
 
 ```java
 public class SomeClass {
     Unit<A>                     unit;    // 1 element
     Pair<A,B>                   pair;    // 2 elements
     Triplet<A,B,C>              triplet; // 3 elements
     Quartet<A,B,C,D>            quartet; // 4 elements
     Quintet<A,B,C,D,E>          quintet; // 5 elements
     Sextet<A,B,C,D,E,F>         sextet;  // 6 elements
     Septet<A,B,C,D,E,F,G>       septet;  // 7 elements
     Octet<A,B,C,D,E,F,G,H>      octet;   // 8 elements
     Ennead<A,B,C,D,E,F,G,H,I>   ennead;  // 9 elements
     Decade<A,B,C,D,E,F,G,H,I,J> decade;  // 10 elements
 }
 ```

Assemblers support assembling and merging a single DTO with multiple aggregates by using tuples. To do so:

* Extend the tuple variants of assembler classes:
  * {{< java "org.seedstack.business.assembler.modelmapper.ModelMapperTupleAssembler" >}} instead of {{< java "org.seedstack.business.assembler.modelmapper.ModelMapperAssembler" >}}.
  * {{< java "org.seedstack.business.assembler.BaseTupleAssembler" >}} instead of {{< java "org.seedstack.business.assembler.BaseAssembler" >}}.    
* Specify a tuple of aggregates in place of the single aggregate generic parameter.  