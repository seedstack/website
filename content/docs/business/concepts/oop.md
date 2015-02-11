+++
title       = "Additional concepts"
zones     = [ "business" ]
sections  = [ "concepts" ]
+++

# Assemblers

Assembler is a pattern that allows transformation from one object kind to another one, by copying its state from the
first to the other and vice-versa.

<div class="callout callout-info">
The main <a href="#!/business-doc/hands-on-interface/expose-domain#assemblers">use of Assemblers in SEED Business Framework</a>
is to transform Entities of the Domain into DTO/representations to be used outside of the domain. Naming conventions tend
to keep "DTO" for transfer objects used inside the application layer while a "representation" is the name given to a DTO
that is meant to be exposed in the interface layer.
</div>

# Tuples

Tuples are structures which are not so commonly used in OOP. They can be compared to a C struct but typed. SEED Business
Framework uses [javatuples.org](http://javatuples.org) for its Tuple implementation. Some content in this page comes
from this website. Please refer to that documentation for more detail.

A tuple is just a sequence of objects that do not necessarily relate to each other in any way.
For example: `[23, "Saturn", java.sql.Connection@li734s]` can be considered a tuple of three elements (a triplet)
containing an Integer, a String, and a JDBC Connection object.

---

[javatuples](http://javatuples.org) offers you tuple classes from one to ten elements:
```
Unit<A> (1 element)
Pair<A,B> (2 elements)
Triplet<A,B,C> (3 elements)
Quartet<A,B,C,D> (4 elements)
Quintet<A,B,C,D,E> (5 elements)
Sextet<A,B,C,D,E,F> (6 elements)
Septet<A,B,C,D,E,F,G> (7 elements)
Octet<A,B,C,D,E,F,G,H> (8 elements)
Ennead<A,B,C,D,E,F,G,H,I> (9 elements)
Decade<A,B,C,D,E,F,G,H,I,J> (10 elements)
```

Plus a couple of very common 2-element tuple classes equivalent to Pair, just for the sake of code semantics:

```
KeyValue<A,B>
LabelValue<A,B>
```
All tuple classes are:

- Typesafe
- Immutable
- Iterable
- Serializable
- Comparable (implements Comparable<Tuple>)
- Implementing equals(...) and hashCode()
- Implementing toString()

## Uses

- function signature 

	- A function can return multiple objects: `Triplet<Integer,Integer,Integer> getYearMonthDay();`
	- Provide a consistent set as a function argument: `Date getDateFrom(Triplet<Integer,Integer,Integer> yearMonthDay);`

- coupling

A Tuples library provides a convenient way to couple heterogeneous data without requiring to create any temporary object that would have no real meaning.

- other

See [Using javatuples](http://www.javatuples.org/using.html)



