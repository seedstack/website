Functions as applications must be covered with unit tests, integrations and web integration tests.

> Their is currently no Node.js envirenment provided. But it is still possible and recommanded to make Javascript code coverage with a local Node.js installation. [More resources](https://docs.angularjs.org/guide/unit-testing).

The only difference with applications is that functions are not packaged as WAR. So they have to be embedded in another application in order to test W20 screen.

The easiest way to do so is to [generate a new scaffold project](#!/seed-maven-plugin-doc/) and to add the function maven dependency and the configuration.
