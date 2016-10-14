---
title: "Generate goal"
type: "home"
zones:
    - "Seed"
sections:
    - "SeedMavenPlugin"
tags:
    - "maven"
    - "plugin"
    - "project"
    - "generation"
    - "archetype"
menu:
    SeedMavenPlugin:
        weight: 20
---

To create a SeedStack project from scratch you can use `generate` goal from the SeedStack Maven Plugin.
This goal is invoked from the command line.<!--more-->

# Parameters

Parameters should be given as system properties (`-DparameterName=parameterValue`):

<table class="table table-striped table-bordered table-condensed">
    <thead>
    <tr>
        <th>Name</th>
        <th>Type</th>
        <th>Mandatory</th>
        <th>Description</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>groupId</td>
        <td>String</td>
        <td>Yes</td>
        <td>The group identifier of your generated project. <strong>Required.</strong></td>
    </tr>
    <tr>
        <td>artifactId</td>
        <td>String</td>
        <td>Yes</td>
        <td>The artifact identifier of your generated project. <strong>Required.</strong></td>
    </tr>
    <tr>
        <td>version</td>
        <td>String</td>
        <td>No</td>
        <td>The version of your generated project. Defaults to <code>1.0.0-SNAPSHOT</code>.</td>
    </tr>
    <tr>
        <td>type</td>
        <td>String</td>
        <td>No</td>
        <td>Specifies the archetype type to use for project generation. Needed if <code>archetypeArtifactId</code> is
        not specified explicitly. No default value. <strong>Available types are: web, rest, domain and batch.</strong></td>
    </tr>
    <tr>
        <td>allowSnapshots</td>
        <td>Boolean</td>
        <td>No</td>
        <td>Allow to use archetype snapshots. Defaults to <code>false</code>.</td>
    </tr>
    <tr>
        <td>archetypeGroupId</td>
        <td>String</td>
        <td>No</td>
        <td>Allow to explicitly specify the archetype group identifier. Defaults to <code>com.inetpsa.fnd.tools</code>.</td>
    </tr>
    <tr>
        <td>archetypeArtifactId</td>
        <td>String</td>
        <td>No</td>
        <td>Allow to explicitly specify the archetype artifact identifier. Needed if <code>type</code> is not specified. Defaults to <code>seed-{type}-archetype</code>.</td>
    </tr>
    <tr>
        <td>archetypeVersion</td>
        <td>String</td>
        <td>No</td>
        <td>Allow to explicitly specify the archetype version. Defaults to latest release version available or to the latest snapshot available
        if <code>allowSnapshots</code> is also specified.</td>
    </tr>
    </tbody>
</table>

# Examples

Interactive mode:

    mvn org.seedstack:seedstack-maven-plugin:generate

Batch mode:

    mvn org.seedstack:seedstack-maven-plugin:generate -DgroupId=org.myorganization -DartifactId=myproject -Dtype=web
    
The `type` property can be any of the archetype names provided by the distribution (i.e.: web, rest, domain, ...). 
