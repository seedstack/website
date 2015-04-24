---
title: "Testing"
type: "guide"
zones:
    - "Guides"
sections:
    - "CreateFunctionGuide"
menu:
    CreateFunctionGuide:
        weight: 70
---

Functions as applications must be covered with unit tests and integration tests.

# Backend tests

You can test the backend modules (i.e. the `specs`, `core` and `rest` modules) in a classic way:

* Writing unit tests for `specs`, `core` and `rest` using the [unit test support]({{< relref "unit.md" >}}),
* Writing integration tests for `core` using the [integration test support]({{< relref "integration.md" >}}),
* Writing Web integration tests for `rest` using the [Web integration test support]({{< relref "integration-web.md" >}}),

# Frontend test

You can test the frontend code in its own module (i.e. `static`) using pure frontend testing. We recommend to use
[Karma test runner](http://karma-runner.github.io/) through [Grunt task runner](http://gruntjs.com/). If your frontend
is based on W20 you can use the [RequireJS Karma extension](http://karma-runner.github.io/0.12/plus/requirejs.html). 
If you created the function using the SeedStack tools, this is already configured for the `static` module.
 
If the frontend code is under a folder of the `web` module (like `src/main/webapp`) you can use the 
[Grunt Maven plugin](https://github.com/allegro/grunt-maven-plugin) to invoke grunt (and then karma) from the maven build.

{{% callout info %}}
Frontend testing require the [NodeJS environment](https://nodejs.org/) being installed.
{{% /callout %}}
