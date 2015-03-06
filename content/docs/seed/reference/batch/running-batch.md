---
title: "Running batch"
type: "reference"
zones:
    - "Seed"
sections:
    - "SeedBatch"
tags:
    - "batch"
    - "cli"
    - "uber-jar"
    - "shade"
    - "maven"
menu:
    SeedBatch:
        weight: 30
---

To run the job we use the `SeedRunner` as main class (`SeedRunner` belongs to SEED CLI support).  For more information about `SeedRunner` please refer to SEED CLI support documentation.

# Eclipse configuration

-   Right click on project
-   Click on "Run A" 
-   Click on "Run Configurations...""
-   Fill in the fields as in following screenshot.

![SeedRunner](/img/seed/batch/seed-runner.png)

-   Project :`SimpleSeedBatch`
-   Main Class: `com.inetpsa.seed.cli.runner.SeedRunner`.


Then switch to the arguments tab:

- Add **--job mySimpleJob** into Program arguments fields
- Click on the Run button. (-Ddebug=true is optional)
![Arguments](/img/seed/batch/arguments.png)

Check for expected "---My Simple Job----" message in logging output:

```
.....
17:11:44.172 [main] INFO  c.i.s.c.r.SeedRunner$SeedCallable - Starting Command Line Handler : spring-batch2-commandline-handler
17:11:44.299 [main] INFO  o.s.b.c.l.support.SimpleJobLauncher - Job: [FlowJob: [name=mySimpleJob]] launched with the following parameters: [{}]
17:11:44.318 [main] INFO  o.s.batch.core.job.SimpleStepHandler - Executing step: [printStep]
12:25:45.538 [main] INFO  c.i.seed.batch.tasklet.PrintTasklet - ---My Simple Job----
17:11:44.376 [main] INFO  o.s.b.c.l.support.SimpleJobLauncher - Job: [FlowJob: [name=mySimpleJob]] completed with the following parameters: [{}] and the following status: [COMPLETED]
17:11:44.377 [main] INFO  c.i.s.b.s.i.SpringBatch2CommandLineHandler - Exit with status : COMPLETED
17:11:44.377 [main] INFO  c.i.s.c.r.SeedRunner$SeedCallable - Ending Command Line Handler. spring-batch2-commandline-handler
17:11:44.377 [main] INFO  c.inetpsa.seed.cli.runner.SeedRunner - Exiting the application
.....

```

# Executable über JAR

To run the batch from a unique JAR, build the project with Apache Maven Shade Plugin. This plugin will package the artifact as an über JAR with all necessary dependencies. 
For more information please refer to the plugin [documentation](http://maven.apache.org/plugins/maven-shade-plugin/examples/executable-jar.html). See below maven configuration:


```
<build>
    <plugins>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-shade-plugin</artifactId>
            <configuration>
                <transformers>
                    <transformer
                        implementation="org.apache.maven.plugins.shade.resource.AppendingTransformer">
                        <resource>META-INF/spring.handlers</resource>
                    </transformer>

                    <transformer
                        implementation="org.apache.maven.plugins.shade.resource.AppendingTransformer">
                        <resource>META-INF/spring.schemas</resource>
                    </transformer>

                    <transformer
                        implementation="org.apache.maven.plugins.shade.resource.ManifestResourceTransformer">
                        <manifestEntries>
                            <Main-Class>com.inetpsa.seed.cli.runner.SeedRunner</Main-Class>
                        </manifestEntries>
                    </transformer>

                    <transformer
                        implementation="org.apache.maven.plugins.shade.resource.ServicesResourceTransformer" />
                </transformers>
            </configuration>
            <executions>
                <execution>
                    <phase>package</phase>
                    <goals>
                        <goal>shade</goal>
                    </goals>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
```




