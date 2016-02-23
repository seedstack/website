---
title: "Domain events"
type: "home"
zones:
    - "Business"
sections:
    - "BusinessManual"
tags:
    - "publish"
    - "subscribe"
    - "aggregate"
    - "event"
menu:
    BusinessManual:
        weight: 40
---

Seed Business Framework contains an API to manage domain events. The `EventService` service is used to fire events. Events
must be immutable and extend `DomainEvent` (which extends `BaseValueObject`).

{{% callout info %}}
**Notice:** Events can also be defined by implementing the `Event` interface. Nevertheless, this requires to 
implement `equals()` and `hashCode()` methods. Otherwise event test fixtures and call cycle detection will not work.
{{% /callout %}}

For instance this event...

```
class MyEvent extends DomainEvent {
	...
}
```

...could be fired as follows:

```
@Inject
private EventService

@Inject
private MyEventFactory eventFactory;

eventService.fire(eventFactory.createMyEvent());
```

# Handling events

**EventHandlers** must implement `EventHandler` in order to receive fired events: 

    class MyHandler implements EventHandler<MyEvent> {
        @Override
        public void handle(MyEvent event) {
            ...
        }
    }

- `MyHandler` implements `EventHandler<MyEvent>` which means it listens to events of `MyEvent` type.
- `handle` method has to be implemented to define the handler's behaviour.

## Synchronous behavior
Events are fired synchronously and **belong to current transaction**. Depending on `Exception` management, a fired exception might rollback the transaction.

## Event inheritance
If a triggered event is assignable to `MyEvent` (by inheritance), it will also be handled - consequently, a handler that `implements EventHandler<DomainEvent>` will be called on any event implementing `DomainEvent`.


# Testing events

The **seed-business-core-test** module provides an `EventFixture` class for integration tests on events. 

- Test that a given event was handled by an expected `EventHandler`:

```
@Inject
private EventFixture fixture;
...
fixture.given(eventFactory.createMyEvent())
    .whenFired()
    .wasHandledBy(MyHandler.class);
```

- Test that a given event was handled by exactly a provided list of `EventHandler`s:

```
@Inject
private EventFixture fixture;
...
fixture.given(eventFactory.createMyEvent())
    .whenFired()
    .wasHandledExactlyBy(MyHandler.class, MyHandler2.class);
```

- Test that a given event was not handled by an expected  `EventHandler`:

```
@Inject
private EventFixture fixture;
...
fixture.given(eventFactory.createMyEvent())
    .whenFired()
    .wasNotHandledBy(MyHandler3.class);
```

- Test that a given event was generated from an expected `method()` with appropriate *parameters*

```
@Inject
private EventFixture fixture;
...
MyEvent myEvent = eventFactory.createMyEvent(SOME_EVENT_PARAM);
fixtures.given(MyService.class)
     .whenCalled("doSomething", SOME_METHOD_PARAM)
     .eventWasHandledBy(myEvent, MyHandler.class);
```

Test if `MyHandler` handler received `myEvent` event when `doSomething()` method of `MyService` is called.

# Provided events

## Aggregate events

**Seed Business Framework** provides following events:

- `AggregateReadEvent`: triggered when reading an aggregate - eg. repository `load()` method
- `AggregatePersistedEvent`: triggered when persisting an aggregate - eg. repository `save()` method
- `AggregateDeletedEvent`: triggered when deleting an aggregate - eg. repository `delete()` method

Above behaviour is defined by method annotations, respectively: `@Read`, `@Persist` and `@Delete`.
These annotations are only intercepted (and functional) within a repository class implementing `GenericRepository` (read [more](#!/business-doc/hands-on-domain/repository) on repositories).

>This mechanism is disabled by default.

To enable this feature, use following property:
    
    [org.seedstack.business.event]
    domain.watch=true

Handle aggregate read events:

- Define a custom read method:

```
public interface MyRepository extends GenericRepository<AgregateRoot, AggregateIdKey> {
    ...
    @Read
    AgregateRoot loadByName(String name);
    ...
}
```

> `GenericRepository` methods (load, delete, persist, save) are already annotated with appropriate annotations.

- The repository reading method is called, triggering an `AggregateReadEvent`:

```
// fire an AggregateReadEvent for the AgregateRoot
productRepository.loadByName(aggregateName);
```

- `MyHandler` handles the triggered `AggregateReadEvent` event:

```
// handle an AggregateReadEvent
class MyHandler implements EventHandler<AggregateReadEvent> {
    public void handle(BaseRepositoryEvent event) {
        ...
    }
}
```

{{% callout info %}}
**IMPORTANT:** Above handler receives all `AggregateReadEvent` from any repository
`@Read` annotated method. Since `AggregateReadEvent` events contain the aggregate root
class and a context with the called method and its arguments, the handler behaviour can be defined accordingly.
{{% /callout %}}

---

Since all "aggregate events" extend `BaseAggregateEvent`, it is possible to intercept them all in one handler:

```
// handle an BaseAggregateEvent
class MyHandler implements EventHandler<BaseAggregateEvent> {
    public void handle(BaseRepositoryEvent event) {
        // if "event" depends on Product aggregate
        if (Product.class.isAssignableFrom(event.getAggregateRoot())) {
            ...
        }
    }
}
```

> See above [handlers](#!/business-doc/hands-on-domain/events#handling-events) documentation for more detail about their generic behaviour.
