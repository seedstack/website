---
title: "Health checks"
type: "manual"
zones:
    - "Seed"
sections:
    - "SeedMetrics"
tags:
    - "metrics"
    - "health"
    - "command"
menu:
    SeedMetrics:
        weight: 20
---

To implement an HealthCheck, extend the class `com.codahale.metrics.health.HealthCheck` and implement method `check()`:

	public class MyHealthCheck extends HealthCheck {

		@Override
		protected Result check() throws Exception {
			return Result.healthy("I'm fine !");
		}

	}

An health check can only return "healthy" or "unhealthy" with a message. All health checks are automatically registered.

# Executing HealthChecks in shell

If you activated the shell commands, you can run the `metrics:health` command to execute health checks. You can restrict
to one health check by specifying its name with the `-n` or `--name` option.

# Executing HealthChecks in your code

If you ever want to execute HealthChecks in your code, inject the HealthCheckRegistry and execute method *runHealthChecks()*

	@Inject
	private HealthCheckRegistry healthCheckRegistry;

	SortedMap<String, HealthCheck.Result> results = healthCheckRegistry.runHealthChecks();

