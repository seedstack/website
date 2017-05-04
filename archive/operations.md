---
title: "Operations"
type: "home"
zones:
    - "Seed"
sections:
    - "SeedManual"
tags:
    - "shell"
    - "metrics"
    - "monitoring"
    - "ssh"
menu:
    SeedManual:
        weight: 80
---

Seed provides the necessary tools to closely monitor the performance and the availability of your application or service,
and even to take action if necessary. It does so by capturing metrics on key application components and checking their 
health status. Custom metrics and health-checks can be defined. If you need to take action, you can execute predefined 
or custom management commands through SSH.<!--more-->
  
{{< dependency g="org.seedstack.seed" a="seed-metrics" >}}

# Metrics

When enabled, this module will automatically capture key metrics throughout the framework. Additionally it provides the
ability for you to define 5 types of custom metrics:

* **Gauge**, which simply collects a value.
* **Counter**, which is an incrementing or decrementing value.
* **Histogram**, which measures the distribution of values in a stream of data. 
* **Meter**, which measure the rate at which a set of events occur.
* **Timer**, which combines an histogram of an event duration and a meter of the rate of its occurrence.

{{% callout info %}}
Seed metrics module implementation is based on the [Metrics](http://metrics.dropwizard.io/) library. Please check its
documentation for more information.
{{% /callout %}}

## Annotations

Metrics can automatically be registered through annotations. To register a Gauge, use the <{{< java "com.codahale.metrics.annotation.Gauge" "@" >}}
annotation on any method:

    @Gauge(name = "queueSize")
    public int getQueueSize() {
        return queue.size;
    }

You can also use its {{< java "com.codahale.metrics.annotation.CachedGauge" "@" >}} counterpart which allows for a more efficient
reporting of value which are expensive to calculate:

    @CachedGauge(name = "queueSize", timeout = 30, timeoutUnit = TimeUnit.SECONDS)
    public int getQueueSize() {
        return queue.getSize();
    }

The {{< java "com.codahale.metrics.annotation.Counted" "@" >}} annotation will create a counter of the invocations of the
method it is applied to:

    @Counted(name = "fancyName")
    public String fancyName(String name) {
        return "Sir Captain " + name;
    }
    
Note that if the `monotonic` parameter is set to false, the counter is increment upon method entry and decremented upon
method exit. If set to true, the counter only increments, effectively counting the number of method invocations.

The {{< java "com.codahale.metrics.annotation.Metered" "@" >}} annotation will create a meter which will measure the
rate of invocation of the method it is applied to:

    @Metered(name = "fancyName")
    public String fancyName(String name) {
        return "Sir Captain " + name;
    }
    
Its counter-part, the {{< java "com.codahale.metrics.annotation.ExceptionMetered" "@" >}} annotation will create a meter
which will measure the rate of exception throwing of the method it is applied to:

    @ExceptionMetered
    public String fancyName(String name) {
        return "Sir Captain " + name;
    }
    
The more generic {{< java "com.codahale.metrics.annotation.Metric" "@" >}} annotation permits two different uses. When 
applied on an empty Metric field, the corresponding metric will be created and injected:

    @Metric
    public Meter meter;

When applied on a non-empty Metric field, the metric will be registered:

    @Metric
    public Histogram uniformHistogram = new Histogram(new UniformReservoir());
    
In both cases, it is up to the client code to interact with the metric.       

## Registry

If you need more control over the metrics registration process, you can inject the {{< java "com.codahale.metrics.MetricRegistry" >}}:

    @Inject
    MetricRegistry metricRegistry;
    
This also allows you to interact programatically with any registered metrics.

# Health-checks

An health check is a class that will check a specific state of the application and report it. To create an health check, 
you must extend the {{< java "com.codahale.metrics.health.HealthCheck" >}} class and annotate it with the 
{{< java "org.seedstack.seed.metrics.HealthChecked" "@" >}} annotation:

    @HealthChecked
	public class GoodHealthCheck extends HealthCheck {
	    @Inject
	    MyService myService;

		@Override
		protected Result check() throws Exception {
		    if (myService.isOk()) {
			    return Result.healthy("I'm fine !");
            } else {
                return Result.unhealthy("Boo");
            }
		}

	}

Note that you have access to any injectable instance in your health check.

# Shell

