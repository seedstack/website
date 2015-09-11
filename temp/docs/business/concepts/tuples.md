---
title: "Tuples"
type: "home"
zones:
    - "Business"
sections:
    - "BusinessConcepts"
menu:
    BusinessConcepts:
        weight: 50
---

A tuple is a data structure corresponding to a sequence of immutable
objects. It's just like an array of objects but typed and which can't be changed,
i.e. tuples are immutable.

Tuples are commonly used to:

- Represent a set of data without creating temparary object
  that have no real meaning.
- Easy access to, and manipulation of, a data set.
- Returning mutliple values from a method.
- Passing multiple values to a method through a single parameter.

In the Business framework, we usually see them in factories and
assemblers. As implementation for tuples we use
[javatuples.org](http://javatuples.org). It provides tuple classes
from one to ten elements:

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

Plus a couple of very common 2-element tuple classes equivalent to
Pair, just for the sake of code semantics:

    KeyValue<A,B>
    LabelValue<A,B>

All the tuple classes respect the following properties:

 * Typesafe
 * Immutable
 * Iterable
 * Serializable
 * Comparable (implements Comparable)
 * Implementing equals(...) and hashCode()
 * Implementing toString()

Usage:

    Pair<Integer, String> pair = new Pair<Integer, String>(10, "foo");
    Integer value0 = pair.getValue0();
    String value1 = pair.getValue1();

We also provide an helper class to create tuples.

        Pair<Integer, String> pair = Tuples.create(10, "foo");
        Tuple tuple = Tuples.create(10, "foo", new Customer());
