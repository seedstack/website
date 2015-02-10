# What is a function ?

> It is a programmatic or web API for a functional use case.

# What is its purpose ?

Functions are intended to reuse functional use cases over multiple project (eg. i18n, export).

# What is the difference between a function and an application ?

Functions are not intended to work as standalone but to be embedded in other applications. So functions must be thought to be **configurable not configured**, ie. function users must be able to specify the function  [security](#!/dev-guide/reusable-function/security), [persistence](#!/dev-guide/reusable-function/persistence), etc. In that purpose functions should use \*-specs dependencies where possible.
 
# How to create function from archetype ?

    mvn3 archetype:generate                                 \
      -DarchetypeGroupId=com.inetpsa.fnd.tools              \
      -DarchetypeArtifactId=seed-function-archetype         \
      -Dprd=<PRD>                                           \
      -DgroupId=<my.groupid>                                \
      -DartifactId=<my-artifactId>

> Use the latest version of the archetype.


