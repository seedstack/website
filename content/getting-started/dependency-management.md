---
title: "Dependency management"
zones:
    - "Seed"
sections:
    - "SeedIntroduction"
menu:
    GettingStartedIntroduction:
        weight: 30
---

The SEED modular design implies a sizable amount of modules but they are all managed in a global versioned distribution.
We **strongly recommend** that you use and follow the dependency management of the distribution. Overriding individual
module versions should only be attempted for bug fixes and if counseled by SEED support.

# Version management

Be sure to have the following bom declared in the dependency management of your root
pom. This will manage all the versions of SEED Java modules (and more):

    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.seedstack</groupId>
                <artifactId>seedstack-bom</artifactId>
                <version>???</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        <dependencies>
    <dependencyManagement>

You won't have to specify the version of any other SEED component in your project.

# Supports integration

SEED composites bring you the dependencies commonly used by the different modules of SEED-based projects:

    <dependency>
	    <groupId>org.seedstack</groupId>
		<artifactId>???-composite</artifactId>
		<type>pom</type>
	</dependency>

Where `???` can be one of the following:

- domain,
- app,
- web.

Below you'll find a list of dependencies provided by those composites. You can add any additional dependency you may need
in your project development, but be sure to respect the module purposes (no seed-web-support in an app module for instance).

## The app composite

<table class="table table-bordered table-striped">
<tr><th>GrouId</th><th>ArtifactId</th></tr>
<tr><td>org.seedstack.seed</td><td>seed-core-support-core</td></tr>
<tr><td>org.seedstack.seed</td><td>seed-security-support-core</td></tr>
<tr><td>org.seedstack.seed</td><td>seed-persistence-jpa-support</td></tr>
<tr><td>org.seedstack.seed</td><td>seed-validation-support</td></tr>
<tr><td>org.seedstack.seed</td><td>seed-shell-support</td></tr>
<tr><td>org.seedstack.business</td><td>seed-business-core</td></tr>
<tr><td>org.seedstack.business</td><td>seed-business-jpa</td></tr>
</table>

## The web composite

<table class="table table-bordered table-striped">
<tr><th>GrouId</th><th>ArtifactId</th></tr>
<tr><td>org.seedstack.seed</td><td>seed-web-support-core</td></tr>
<tr><td>org.seedstack.seed</td><td>seed-web-support-security</td></tr>
<tr><td>org.seedstack.seed</td><td>seed-rest-support-core</td></tr>
<tr><td>org.seedstack.seed</td><td>seed-integrationtest-web-support</td></tr>
<tr><td>org.seedstack.business</td><td>seed-business-web</td></tr>
<tr><td>org.seedstack.functions.w20</td><td>seed-w20-function-web</td></tr>
</table>

## The domain composite

<table class="table table-bordered table-striped">
<tr><th>GrouId</th><th>ArtifactId</th></tr>
<tr><td>org.seedstack.seed</td><td>seed-validation-support</td></tr>
<tr><td>org.seedstack.business</td><td>seed-business-core</td></tr>
<tr><td>org.seedstack.business</td><td>seed-business-jpa</td></tr>
</table>
