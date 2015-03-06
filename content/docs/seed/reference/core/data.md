---
title: "Data"
type: "reference"
zones:
    - "Seed"
sections:
    - "SeedCore"
tags:
    - "api"
    - "command"
    - "data"
    - "import"
    - "export"
menu:
    SeedCore:
        weight: 50
---

SEED Core provides features to backup and restore data. This could be done through the (SEED shell)[#!/seed-doc/shell] 
or data could be loaded at the application startup. Data can be backed up and restored independently from the type of 
persistence since YAML is used as the pivotal format. Consequently, no SQL script or conversion script is needed. Data 
import can also be used to initialize data for integration tests.

# Data Export
Your export class has to implement `DataExporter<ClassToExport>`. This interface provides an `exportData` method 
returning the data to export. The class implementing `DataExporter` should be annotated with `@DataSet` which provides 
a functional ID to the data. As below described, `@DataSet` takes a `group` (eg. application ID) and a `name` (eg. the 
type of objects being exported).

Implementation example from **seed-i18n-function**: 

    @Transactional
    @DataSet(group="seed-i18n", name="key")
    public class KeyDataExporter implements DataExporter<KeyDTO> {
    
        @Inject
        private KeyRepository keyRepository;
    
        @Inject
        private Assemblers assemblers;
    
        @Override
        public Iterator<KeyDTO> exportData() {
            return assemblers.assembleDtoFromEntity(KeyDTO.class, keyRepository.loadAll()).iterator();
        }
    }

# Import data
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

# Shell command

SEED Core also provides SHELL commands to import and export data. This requires (SEED shell support)[#!/seed-doc/shell].

Predefined commands:

    core:export
      -g --group : filter on group
      -s --set   : filter on name

    core:import
      -c --clear : Clear existing data if import is succeeding
      
Usage:

	ssh -t admin@localhost -p 2222 "core:export" > data.yaml

	ssh -t admin@localhost -p 2222 "core:import" < data.yaml

# Auto initialization

Data could be automatically loaded at the application startup by adding the exported YAML file(s) in 
`META-INF/data/{group}/{name}.yaml`. These data files will be loaded unless the application is already initialized 
(according to your `isInitialized()` method implementation). Initialization can be forced each time this application 
is started by adding this property:

    [com.inetpsa.seed.core]
    data-initialization = force

