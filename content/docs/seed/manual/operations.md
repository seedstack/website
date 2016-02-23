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
        weight: 60
---

Seed provides the necessary tools to closely monitor the performance and the availability of your application or service,
and even to take action if necessary. It does so by capturing metrics on key application components and checking their 
health status. Custom metrics and health-checks can be defined. If you need to take action, you can execute predefined 
or custom management commands through SSH. 
  
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
Seed metrics module implementation is based on the [Metrics](http://metrics.codahale.com/) library. Please check its
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

Seed shell provides administrative access to application commands through SSH protocol in two different modes:

* Interactive mode consists in providing of a simple line-based shell with auto-completion, history and the ability to display
command results as a string. In this mode, commands have no access to low-level input, output and error streams. They
take and produce discrete objects that are displayed as strings.
* Direct mode consists of a single command executed through an ssh remote invocation. In this mode, commands have
access to low-level input, output and error streams and thus can be combined with other commands on the client system.

{{< dependency g="org.seedstack.seed" a="seed-shell" >}}

## Configuration

The configuration properties defining the shell support behavior are:

* `org.seedstack.seed.shell.enabled` which determines if shell access is enabled or not.
* `org.seedstack.seed.shell.port` defines the port the SSH server will listen to. Defaults to 2222.
* `org.seedstack.seed.shell.key.type` defines what type of cryptographic key to use:
    * `generated` is the simplest and default mode. It generates a key in the application storage directory which is used 
    in subsequent authentication challenges. **Please note that this key type is NOT secured from a SSH perspective.**
    * `file` mode specifies the cryptographic key location on the filesystem via the `org.seedstack.seed.shell.key.location`
    configuration property. The key must be provided in a JCE serialized format.
    * `resource` mode specifies the cryptographic key location on the classpath via the `org.seedstack.seed.shell.key.location`
    configuration property. The key must be provided in a JCE serialized format.
   
{{% callout warning %}}
For security reasons, shell access is disabled by default even when the dependency is in the classpath. If shell access, 
is required, set the `org.seedstack.seed.shell.enabled` configuration property to `true`. **In that case, it is strongly 
recommended to configure a real SSH key.**
{{% /callout %}}    

## Commands

All commands registered in the {{< java "org.seedstack.seed.CommandRegistry" >}} can be invoked from both interactive 
and direct modes. You can specify command name, arguments and options using a GNU-like syntax:

    [scope:]cmdname -s -sval --long-option --long-option-with-arg=argval arg0 arg1 arg2�
    
Note that:
    
* The command scope must be specified as a prefix of the command name, delimited by a colon character.
* Short options are specified using the dash character (-) immediately followed by the option name and a value if needed.
* Long options are specified with two dash characters (--) immediately followed by the option name and, if required, an equal sign with a value.
* Arguments are specified respecting the command arguments order.


