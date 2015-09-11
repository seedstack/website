---
title: "Dependency injection"
type: "home"
zones:
    - "Seed"
sections:
    - "SeedConcepts"
tags:
    - "ioc"
    - "injection"
    - "guice"
    - "aop"
menu:
    SeedConcepts:
        weight: 30
---

In a SeedStack application, the dependency injection is provided by a Guice injector, created by the kernel in its
starting phase. The injector is configured in explicit mode, meaning that all the application injection points
are checked during application startup and must be resolvable. This mode ensures that injection errors are detected as
soon as possible in the development process.

Although Guice is operating behind the scenes, it is invisible for the application which only needs to rely on JSR 330
annotations for defining injection points.

# Injection points

When applying the dependency injection pattern, the dependencies are passed in instead of being requested directly or
by calling factories. The process of setting dependencies into an object is called injection. In SeedStack the injections
are explicit and almost always marked with the `@Inject` annotation. The element marked with the `@Inject` annotation
is called the **injection point**.

There are multiple injection styles, described below, and they all can be used simultaneously. 

## Constructor injection

Constructor injection combines instantiation with injection. To use it, annotate the constructor with the `@Inject`
annotation. This constructor should accept class dependencies as parameters. It is then recommended to assign the
parameters to final fields in the constructor.

    public class MyServiceImpl implements MyService {
        private final OtherService otherService;
        
        @Inject
        public MyServiceImpl(OtherService otherService) {
            this.otherService = otherService;
        }
    }

If your class has no `@Inject`-annotated constructor, a public, no-arguments constructor will be used if it exists,
otherwise an exception will be thrown upon application startup.

The constructor injection style has two main benefits:

* The ability to construct injected immutable instances,
* The explicit constructor arguments will make unit testing easier: when you construct a test instance manually, you 
are still required by compiler to provide all the dependencies.     

   
## Field injection

Fields injection points are fields annotated with `@Inject` and are injected just after instance creation.

    public class MyServiceImpl implements MyService {
        @Inject 
        private OtherService otherService;
    }

Avoid using field injection with final fields, which are not guaranteed to succeed in some contexts.

## Method injection

Method injection points are methods annotated with `@Inject` are called just after field injections. Dependencies take
the form of parameters, which the injector resolves before invoking the method. Injected methods may have any number of
parameters, and the method name does not impact injection.

    public class MyServiceImpl implements MyService {
        private OtherService otherService;

        @Inject
        public void doInjection(OtherService otherService) {
            this.otherService = otherService;
        }
    }

# Injection scopes

By default, the injector returns a new instance each time it supplies a value. This behavior can be altered by applying
a scope to the implementation class. Scopes allow to reuse instances like the `@Singleton` scope which will make the
injector always return the same instance for the lifetime of the application. Annotations are used to identify scopes. 
Specify the scope for a type by applying the scope annotation to the implementation class:

    @Singleton
    public class MyServiceStatefulImpl implements MyService {
        /* everything here should be thread safe! */
    }
    
By default in SeedStack, almost every class managed by the injector has no scope associated, which means that a new
instance is created for each injection. This is a desirable behavior because it minimizes the mutability of your code and, as
such, minimizes the need to use concurrency protection (synchronized, ThreadLocal, ...). In the end, all the bugs associated
with such techniques are avoided.

In some cases, you'll need to specify a scope though:

* If an object is inherently stateful (like a counter or a cache),
* If an object is expensive to create,
* If an object is tied up to external resource.

Note that since the technical aspects that are often the motivation to implement a singleton are already handled by
the framework, it is unlikely that you will need to apply this scope yourself. Remember that by keeping your **application
code as stateless and immutable as possible** you will:

* Reduce the probability of bugs,
* Improve its scalability,
* Improve its testability.

# Static injections

Injection on static fields is a specific case of injection that requires an explicit binding that is very rarely used
in SeedStack internal code and never in application code. It means that, by default, injection on static fields of your 
classes won't be enabled. This is a good thing because static injections are difficult to test, make dependencies opaque
and rely on global state.

# Custom injections

Custom injections can be used for advanced injection behavior that is not possible to achieve through the standard 
`@Inject` injection points. They rely instead on specific annotations to trigger the injection. For instance, the Java 
framework core support provides a custom injection for loggers which inject a SLF4J logger of the name of the injected 
class:
 
    public class MyClass {
        @Logging
        private Logger logger;
        
        ...
    }
    
Note the usage of the `@Logging` annotation instead of `@Inject`. SeedStack doesn't rely heavily on custom injection, using
standard injection wherever possible.

# Method interception

To complement dependency injection, method interception is sometimes used in SeedStack. It allows to execute code each
time a *matching* method is invoked. It is suitable for cross cutting concerns ("aspects") and is notably used, among
other things, for transaction and security.

Method interception is transparent for the application code but its implementation (which works by dynamically sub-classing
and overriding matching methods) impose some limitations that you should know:
 
* Classes must be public or package-private,
* Classes must be non-final,
* Methods must be public, package-private or protected,
* Methods must be non-final,
* Instances must be created by the injector. It is not possible to use method interception on instances that aren't 
constructed by the injector.

# More information

For more information about the injector used in the Java framework, you can look at the 
[Guice documentation wiki](https://github.com/google/guice/wiki). Please note that some Guice features described
in this documentation are not available in SeedStack or implemented differently. A knowledge of Guice is **NOT**
necessary to develop a Seed-based application.