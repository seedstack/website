---
title: "Crypt goal"
type: "home"
zones:
    - "Docs"
tags:
    - maven
aliases: /docs/maven-plugin/manual/crypt    
menu:
    docs:
        parent: "maven"
        weight: 90
---

The `crypt` goal encrypts the given argument using the application configured `master` key store and the specified alias. <!--more-->
This allows to [encrypt sensitive configuration values](/docs/seed/manual/crypto#encrypting-configuration-sensitive-values). 

{{% callout tips %}}
This goal executes the [crypt tool](/docs/seed/manual/crypto#the-crypt-tool) on the project.
It is a shortcut for the [tool goal](../tool) with `crypt` specified as first argument.
{{% /callout %}}

{{% callout info %}}
This goal requires a properly configured key store, named `master`, in the application. See [this page](/docs/seed/manual/crypto#key-stores)
for more information about configuration key stores.
{{% /callout %}}

## Parameters

Parameters can be given as system properties (`-DparameterName=parameterValue`) or specified in the `pom.xml` plugin declaration:

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
        <td>Yes</td>
        <td>The string of all arguments passed to the crypt tool.</td>
    </tr>
    </tbody>
</table>

## Examples

Encryption of a password using alias `alias1` in the `master` key store:
  
```bash
mvn -Dargs="--alias alias1 thePasswOrd" -q org.seedstack:seedstack-maven-plugin:crypt
```
