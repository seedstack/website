---
title: "More"
type: "home"
zones:
    - "Seed"
sections:
    - "SeedManual"
tags:
    - "jdni"
    - "data"
menu:
    SeedManual:
        weight: 99
---

# JNDI

Seed provides the ability to inject external JNDI resources through the `@Resource` annotation. Multiple JNDI contexts can
be used in an application by using the `@FromContext` annotation.

## Declaring JNDI contexts

The default JNDI context is automatically configured by Seed if you provide a `jndi.properties` file in `META-INF/configuration` classpath-included folder.
This JNDI context is named `default` by Seed.

Additional JNDI contexts can be specified using the following configuration properties:

    additional-jndi-contexts = additional1, additional2
    additional-jndi-context.additional1 = /jndi-ctx-1.properties
    additional-jndi-context.additional2 = /jndi-ctx-2.properties

The above code defines two additional JNDI contexts, named `additional1` and `additional2`. The specified properties
files are `jndi.properties`-like files.

## Using JNDI context

### Declarative API

You can inject JNDI resource using the `@Resource` annotation from JSR-245:

    public class Holder{
        @Resource(name = "THE_JNDI_NAME")
        private DataSource datasource;
    }

The above lookup for `THE_JNDI_NAME` in `default` JNDI context is injected into `datasource` attribute.

In case you have several JNDI contexts in your application, you can specify the context name as follows:

    public class Holder{
        @Resource(name = "THE_JNDI_NAME")
        @FromContext("additional1")
        private DataSource datasource;
    }

### Programmatic API

You can retrieve any context by injecting it into your code. Then you can use the JNDI programmatic API to lookup
for resources in that context.

You can inject the `default` context as follows:

    public class Holder{
        @Inject
        private Context defaultCtx;

        public void m(){
           MyJNDIResource test = defaultCtx.lookup("THE_JNDI_NAME");
        }
    }

If you need to precise another context, you can specify the context as follows:

    public class Holder{
        @Inject
        @Named("additional1")
        private Context additional1;

        public void m(){
           MyJNDIResource test = additional1.lookup("THE_JNDI_NAME");
        }
    }

# Data import/export

Seed provides features to backup and restore data. This could be done through [Seed Shell](/docs/seed/manual/operations/#shell)
or data could be loaded at the application startup. Data can be backed up and restored independently from the type of 
persistence since JSON is used as the pivotal format. Consequently, no SQL script or conversion script is needed. Data 
import can also be used to initialize data for integration tests.

## Data Export
Your export class has to implement `DataExporter<ClassToExport>`. This interface provides an `exportData` method 
returning the data to export. The class implementing `DataExporter` should be annotated with `@DataSet` which provides 
a functional ID to the data. As below described, `@DataSet` takes a `group` (eg. application ID) and a `name` (eg. the 
type of objects being exported).

Implementation example: 

    @JpaUnit("seed-i18n-domain")
    @Transactional
    @DataSet(group="seed-i18n", name="key")
    public class KeyDataExporter implements DataExporter<KeyDTO> {
    
        @Inject
        private KeyRepository keyRepository;

        @Inject
        private FluentAssembler fluentAssembler;
      
        @Override
        public Iterator<KeyDTO> exportData() {
            List<Key> keys = keyRepository.loadAll();
            return fluentAssembler.assemble(keys).to(KeyDTO.class).iterator();
        }
    }

## Import data
Your export class has to implement `DataImporter<ClassToImport>`. This interface provides:

- an `isInitialized` method to check before importing data (can be disabled with a property)
- an `importData`  method consuming the data to import (eg. feed a staging collection). 
- a `commit` method to commit data after `importData`
- a `rollback` method to roll back data upon error in prior steps

The class implementing `DataImporter` should be annotated with `@DataSet`. As for Export, this annotation provides
a functional ID to the imported data. As below described, `@DataSet` takes a `group` (eg. application ID) and a `name` 
(eg. the type of objects being imported).

Implementation example from **seed-i18n-function**: 

    @Transactional
    @DataSet(group="seed-i18n", name="key")
    public class KeyDataImporter implements DataImporter<KeyDTO> {
    
        @Inject
        private KeyRepository keyRepository;
    
        private Set<KeyDTO> staging = new HashSet<KeyDTO>();
    
        @Inject
        private Assemblers assemblers;
    
        @Override
        public boolean isInitialized() {
            // check if data are already initialized
            ...
            return initialized;
        }
    
        @Override
        public void importData(KeyDTO data) {
            staging.add(data);
        }
    
        @Override
        public void commit(boolean clear) {
            if (clear) {
                // delete data before adding new one
                ...
            }
            for (KeyDTO keyDTO : staging) {
                // persist data
                ...
            }
            staging.clear();
        }
    
        @Override
        public void rollback() {
            staging.clear();
        }
    }

## Shell command

Seed also provides commands to import and export data. You can invoke this kind of commands through 
[Seed Shell](/docs/seed/manual/management#shell):

    core:export
      -g --group : filter on group
      -s --set   : filter on name

    core:import
      -c --clear : Clear existing data if import is succeeding
      
Usage:

	ssh -t admin@localhost -p 2222 "core:export" > data.json

	ssh -t admin@localhost -p 2222 "core:import" < data.json

## DataManager

If you want to handle import or export from your code, you can do it by injecting the `DataManager` class.

## Auto initialization

Data can be automatically loaded at the application startup by adding the exported JSON file(s) in 
`META-INF/data/{group}/{name}.json`. These data files will be loaded unless the application is already initialized 
(according to your `isInitialized()` method implementation). Initialization can be forced each time this application 
is started by adding this property:

    [org.seedstack.seed.core]
    data-initialization = force

Data loading can also be disabled by setting the property to `none`:

    [org.seedstack.seed.core]
    data-initialization = none
    
