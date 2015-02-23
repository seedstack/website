---
title: "Overview"
type: "reference"
zones:
    - "Seed"
sections:
    - "SeedMetrics"
menu:
    SeedMetrics:
        weight: 10
---

SEED Metrics support provides the ability to collect metrics in a java application. It relies on the 
[Metrics](http://metrics.codahale.com/) library. To add the support to your project, simply add the following 
dependency to your application module:

	<dependency>
		<groupId>org.seedstack.seed</groupId>
		<artifactId>seed-metrics-support</artifactId>
	</dependency>

# Health checks

An health check is a class that will check a specific state of the application. To create an health check, make your class 
extend `com.codahale.metrics.health.HealthCheck`.

	public class GoodHealthCheck extends HealthCheck {

		@Override
		protected Result check() throws Exception {
			return Result.healthy("I'm fine !");
		}

	}

You can inject any managed Object in your health check to check it.

# Metrics
The metrics library provides 5 metrics to measure you application. Metrics are stored in a MetricRegistry that you can 
inject in your classes.

- Gauge (automatically registered with the `@Gauge` or `@CachedGauge` annotations on any method),
- Counter (automatically registered with the `@Counted` annotation on any method),
- Meter (automatically registered with the `@Metered` or `@ExceptionMetered` annotations on any method),
- Timer (automatically registered with the `@Timed` annotation on any method),
- Histogram (registered programatically with the `MetricRegistry` or trough the `@Metric` annotation on an `Histogram` field).

Please refer to Metrics documentation for more information on these metrics.
