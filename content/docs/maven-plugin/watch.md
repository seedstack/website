---
title: "Watch goal"
type: "home"
zones:
    - "Docs"
tags:
    - maven
menu:
    docs:
        parent: "maven"
        weight: 31
---

The `watch` goal runs any self-executable SeedStack application in hot-reloading mode.<!--more-->

## Parameters

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
        <td>args</td>
        <td>String</td>
        <td>No</td>
        <td>The string of all arguments used to run the Seed application.</td>
    </tr>
    </tbody>
</table>

## Limitations

Currently, the following limitations apply:

* If you do some change on a custom repository interface without implementation, the framework-generated implementation
will not be updated. A full restart of the watch goal will be necessary.
* Only java files are monitored. Configuration files and others will be in a future release.

## Example

{{% callout info %}}
Application refresh is only supported for Web application using the Undertow embedded server.
{{% /callout %}}

Start the application in hot-reloading mode with:

```bash
mvn seedstack:watch
```
