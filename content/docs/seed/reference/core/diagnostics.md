---
title: "Diagnostics"
type: "reference"
zones:
    - "Seed"
sections:
    - "SeedCore"
tags:
    - "diagnostic"
    - "api"
menu:
    SeedCore:
        weight: 60
---

SEED can dump diagnostic information when an exception is catched at key application locations. Core support dumps 
diagnostic information when an uncaught exception occurs in a thread but other supports can trigger dumps in various 
conditions.

Diagnostic information is an aggregation of values gathered from various diagnostic collectors in a single map. This map
is then handled by the diagnostic reporter. 

# Diagnostic collectors

A diagnostic collector is a class implementing the `com.inetpsa.seed.core.spi.diagnostic.DiagnosticInfoCollector` 
interface and annotated with `com.inetpsa.seed.core.spi.diagnostic.DiagnosticDomain`:

    @DiagnosticDomain("com.inetpsa.prd.my-diagnostic-domain")
    public class MyDiagnosticCollector implements DiagnosticInfoCollector {

        @Override
        public Map<String, Object> collect() {
            ...
        }
        
    }

All diagnostic collectors are automatically detected by SEED and will be used in diagnostic information gathering. The
diagnostic domain uniquely identifies the information of the collector.

# Diagnostic reporter

The default diagnostic reporter dumps the map as a YAML document in the system temporary directory. The diagnostic 
reporter can be changed by setting the `com.inetpsa.seed.diagnostic.reporter` system property to a class 
implementing `com.inetpsa.seed.core.spi.diagnostic.DiagnosticReporter`.
