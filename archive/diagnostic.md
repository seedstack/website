## Diagnostic collectors

A diagnostic collector is a class implementing the {{< java "org.seedstack.seed.spi.diagnostic.DiagnosticInfoCollector" >}} 
interface and annotated with {{< java "org.seedstack.seed.spi.diagnostic.DiagnosticDomain" "@" >}}:

    @DiagnosticDomain("org.my-organization.my-project.my-diagnostic-domain")
    public class MyDiagnosticCollector implements DiagnosticInfoCollector {

        @Override
        public Map<String, Object> collect() {
            ...
        }
        
    }

All diagnostic collectors are automatically detected by Seed and will be used in diagnostic information gathering. The
diagnostic domain uniquely identifies the information of the collector.

## Diagnostic reporter

The default diagnostic reporter dumps the map as a YAML document in the system temporary directory and logs the filename
at WARNING level. The diagnostic reporter can be changed by setting the `seedstack.diagnostic` system property to a class 
implementing {{< java "org.seedstack.seed.spi.diagnostic.DiagnosticReporter" >}}.

